import express from "express";
import { Client } from "pg";

const app = express();

const client = new Client({
  connectionString: "postgresql://root:example@postgres:5432/mydb",
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    app.get("/", async (req, res) => {
      try {
        const result = await client.query("SELECT NOW()");
        res.json({
          status: "OK",
          dbTime: result.rows[0],
        });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });

  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
    process.exit(1);
  }
}

startServer();