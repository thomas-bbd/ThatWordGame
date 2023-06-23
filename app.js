import express from "express";
import { config } from "dotenv";
import logger from "morgan";


config();
const app = express();
app.use(express.json());
if (["development", "production"].includes(process.env.NODE_ENV)) {
    app.use(logger("dev"));
  }

export default app;