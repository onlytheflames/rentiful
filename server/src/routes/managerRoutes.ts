import express from "express";
import { getManager, createManager } from "../controllers/managerControllers";

const router = express.Router();

// The userId that we pass on the frontend represents the cognitoId/sub
router.get("/:cognitoId", getManager);
router.post("/", createManager);

export default router;
