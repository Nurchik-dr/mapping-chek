import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./mongo.js";
import { overridesRoutes } from "./overrides.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  const { overrides } = await connectDB();
  app.use("/api/overrides", overridesRoutes(overrides));
  
  app.listen(process.env.PORT, () => {
    console.log("Backend running on port " + process.env.PORT);
  });
})();
