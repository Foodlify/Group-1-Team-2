# Load Testing the Order Creation Flow — A Case Study

## Overview

This document walks through a real load-testing exercise performed on Foodlify's `POST /order` endpoint using **Apache JMeter**. It covers the bugs discovered, the root-cause analysis, the fixes applied, and the final verification under concurrent load.

The goal was not just to measure performance, but to use concurrency as a tool to uncover correctness bugs that are invisible under single-user manual testing.

---

## System Under Test

The order creation flow follows a **Chain of Responsibility** pattern. A single service method wraps the entire flow in a Prisma `$transaction`, and delegates the work to a sequence of handlers:

```
Route → Controller → Service (opens DB transaction)
   → CartCheckHandler
   → ValidateCustomerExistHandler
   → validateAddressHandler
   → ItemsAvailabilityCheckHandler
   → FinalizeOrderHandler
→ PaymentProcessHandler (outside the transaction)
```

Each handler validates one concern and either throws a domain-specific exception or passes an enriched `response` object to the next handler. If any handler throws, the entire transaction rolls back — no partial orders are ever persisted.

---

## Bugs Found and Fixed

Load testing this flow with concurrent virtual users surfaced **9 real issues**, ranging from compile-time errors introduced during a service merge to a genuine race condition. All were found and fixed before the final verification test.

| # | Issue | Location | Category |
|---|---|---|---|
| 1 | Wrong env var read (`_EXPIRES_IN` instead of `_SECRET`) | `jwt.ts` | Configuration bug |
| 2 | Refresh token collisions under concurrent logins (identical JWT payload → identical signature) | `signRefreshToken` | Race condition |
| 3 | `restaurantId` referenced a field that didn't exist on the request type | `order.controller.ts` | Compile error |
| 4 | Wrong import path (`runtime/binary` vs `runtime/library`) | `OrderResponse.ts` | Typo |
| 5 | `cartId` missing from the Zod validation schema | `order.validation.ts` | Validation gap |
| 6 | Stale exception import after an exceptions refactor | `authenticate.ts` | Leftover reference |
| 7 | Duplicate route definitions for the same controller | `order.route.ts` | Routing cleanup |
| 8 | Field name mismatch (`customer`/`restaurant`/`address` vs `customerId`/`restaurantId`/`addressId`) between handler output and repository input | `FinalizeOrderHandler` / `order.repository.ts` | Naming mismatch |
| 9 | Repository ignored the passed-in transaction client and used the global Prisma client instead, breaking transactional isolation | `transaction.repository.ts` | Transaction isolation bug |

Bugs #3–#9 were static/logic errors caught by simply exercising the flow end-to-end once outside JMeter (via Postman) before going back to load testing — a reminder that a clean "happy path" run is a prerequisite for meaningful load testing, not a substitute for it.

---

## The Core Concurrency Bug: Overselling

### The problem

The original stock check looked like this:

```typescript
if (menuItem.stock < item.quantity) {
  throw new SomeOfItemsNotAvailableException();
}
// ... stock was never decremented anywhere in the flow
```

This has two separate problems:
1. **No decrement at all** — stock was checked but never consumed, so it never reflected real usage.
2. **Even with a naive decrement added**, checking and updating stock as two separate steps creates a classic **check-then-act race condition**: multiple concurrent requests can all read the same "available" stock value before any of them writes back the decrement, allowing more units to be sold than actually exist.

### The fix: atomic conditional update

```typescript
const result = await client.menuItem.updateMany({
  where: {
    id: menuItemId,
    stock: { gte: quantity },
  },
  data: {
    stock: { decrement: quantity },
  },
});

if (result.count === 0) {
  throw new SomeOfItemsNotAvailableException();
}
```

By folding the availability check and the decrement into a single atomic database operation (`updateMany` with a `WHERE stock >= quantity` clause), the database itself guarantees that no two concurrent requests can both succeed against a quantity that only one of them can actually have. `result.count === 0` unambiguously means "the condition failed at execution time," not "it failed when I last checked."

**The key rule this enforces: never read stock in one step and write it in another.** Any version of this logic that does a `findUnique`/`findFirst` to check the value and then a separate `update` to decrement it — even with the "correct" comparison logic — reopens the same race window, because another request can interleave between the read and the write. The check and the write have to be the *same* database statement.

This logic was placed behind a dedicated `menuItem.service.ts` (`reserveStock`), so the handler stays declarative:

```typescript
await menuService.reserveStock(menuItem.id, cartItem.quantity, client);
```

---

## Load Test Design

### Baseline run: ample stock

Before testing the scarcity scenario, a baseline run was performed against the **unmodified regular seed** — 1,000 customers, each ordering ordinary items (Burger, Pizza) with effectively unlimited stock (100,000 units), no scarce item involved at all.

**Summary Report — Create Order (baseline):**

| Metric | Value |
|---|---|
| Samples | 1000 |
| Average response time | 32 ms |
| Min / Max | 12 ms / 667 ms |
| Std. Dev. | 56.1 |
| **Error %** | **0.0%** |

**Zero failures** across 1,000 fully concurrent requests. This baseline matters because it isolates the variable: the same endpoint, the same concurrency level (1,000 simultaneous threads), the same code path — the only difference in the next test is that stock is deliberately made scarce for a subset of items. Any errors that appear in the scarce-stock run can therefore be attributed specifically to stock exhaustion being handled correctly, not to the server buckling under concurrent load in general.

### Seed setup — scarcity scenario

To make the race condition observable, the seed data was structured deliberately:

- 1,000 seeded customers, each with an active cart and address.
- Regular menu items (Burger, Pizza) with effectively unlimited stock (100,000 units) — these represent normal traffic.
- One `Limited Special Burger` item with **stock = 5**.
- The **first 20 customers'** carts were seeded to each contain exactly 1 unit of the limited item; the remaining 980 carts contain the regular items.

This produces a realistic mixed-traffic scenario: most users are placing ordinary orders while a small subset competes for a scarce item — closer to a real flash-sale scenario than an isolated, artificial test.

### JMeter test plan

```
Thread Group (1000 threads, ramp-up: 1s)
 ├─ CSV Data Set Config (email, password, cartId, addressId — one row per seeded user)
 ├─ HTTP Cookie Manager
 ├─ HTTP Request Defaults (localhost:3000)
 ├─ Login (POST /api/v1/auth/login)
 │   ├─ Header Manager (Content-Type: application/json)
 │   └─ JSON Extractor → ${accessToken} from $.data.accessToken
 ├─ Header Manager (Authorization: Bearer ${accessToken})
 ├─ Create Order (POST /api/v1/order)
 │   └─ Header Manager (Content-Type: application/json)
 ├─ Summary Report
 └─ View Results Tree
```

Each of the 1,000 virtual users authenticates independently via the CSV-driven credentials, extracts its own access token, and submits its own order — mirroring 1,000 distinct real users hitting the endpoint concurrently, not the same account replayed.

---

## Results — Scarcity Scenario

The scarcity test was run **twice**, against two independent, freshly-seeded databases (the second run followed a full `deleteMany` reset, which reassigns new auto-increment IDs — a useful accidental check that the test logic doesn't depend on specific ID values).

**Summary Report — Create Order:**

| Metric | Run 1 | Run 2 |
|---|---|---|
| Samples | 1000 | 1000 |
| Average response time | 29 ms | 33 ms |
| Min / Max | 12 ms / 279 ms | 14 ms / 428 ms |
| Std. Dev. | 18.3 | 39.2 |
| Error % | **1.5%** | **1.5%** |
| Throughput (req/sec) | 27.6 | 46.5 |

### Interpreting the error rate

The 1.5% error rate is not noise — in both runs it is the **exact expected value**:

```
15 failed requests / 1000 total requests = 0.015 = 1.5%
```

Of the 20 users competing for the 5-unit limited item, exactly 5 succeeded and 15 received a clean `"Some of the items are not available"` response — never an unhandled server error. The remaining 980 ordinary requests all succeeded, since their stock was effectively unlimited.

### Why running it twice matters

A single passing run could plausibly be luck — thread scheduling is inherently non-deterministic, and a race condition can hide if the timing doesn't happen to trigger it. Getting the **identical error rate across two independent runs**, on two independently-seeded databases with different auto-generated IDs, is meaningfully stronger evidence: it shows the atomic `updateMany` guard is enforcing the invariant deterministically, not passing by chance. Response times vary between runs (29ms vs 33ms avg) — that's expected, as machine load and JIT warm-up vary — but the correctness metric (error %) does not.

### Verification

- **Final stock of the limited item: 0** (confirmed via Prisma Studio) — not negative, not still positive. Exactly what was available was sold, no more.
- **No `Internal Server Error` responses** — every rejection was a clear, typed exception surfaced to the client.

---

## Takeaways

1. **A stock check without an atomic decrement is not a real check** — it's a check against data that may already be stale by the time you act on it.
2. **Race conditions are invisible in manual, single-user testing.** They only surface under genuine concurrency, which is exactly what load testing is for.
3. **Database-level atomicity (`WHERE` + `UPDATE` in one statement) is a more reliable guard than application-level locking** for this class of problem — there's no window between "check" and "act" for another request to slip through.
4. **Load testing also surfaces plain bugs**, not just concurrency issues — 7 of the 9 issues found here were ordinary logic/typo bugs that a full end-to-end run happened to catch.
