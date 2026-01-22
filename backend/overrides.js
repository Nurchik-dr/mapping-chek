import { Router } from "express";

export function overridesRoutes(overrides) {
  const router = Router();

  router.get("/", async (_, res) => {
    const data = await overrides.find({}).toArray();
    res.json(data);
  });

  router.post("/", async (req, res) => {
    const { key, status, reason } = req.body;
    await overrides.updateOne(
      { key },
      { $set: { key, status, reason } },
      { upsert: true }
    );
    res.sendStatus(200);
  });

  return router;
}
