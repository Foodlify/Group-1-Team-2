import express, { Request, Response } from "express";
import routes from "./routes/index";
import prisma from "./lib/prisma";
import { asyncHandler } from "./utils/asyncHandler";
import globalErrorHandler from "./middlewares/globalError.middleware";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from 'path';


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

// ================= Swagger =================
const spec = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use("/api/v1", routes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(globalErrorHandler);

export default app;