import express, { Request, Response } from "express";
import routes from "./routes/index";
import prisma from "./lib/prisma";
import { asyncHandler } from "./utils/asyncHandler";

const app = express();

// ================= Middleware =================
app.use(express.json());

// ================= Health Check =================
app.get("/", asyncHandler (async (req: Request, res: Response) => {
    const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW()`;

    res.status(200).json({
      status: "OK dev",
      dbTime: result[0].now,
    });
}));

app.use("/api/v1", routes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;