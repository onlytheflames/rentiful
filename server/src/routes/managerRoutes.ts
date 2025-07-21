import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";

const router = express.Router();

// The userId that we pass on the frontend represents the cognitoId/sub
router.get("/:cognitoId", getManager);
router.put("/:cognitoId", updateManager);
router.get("/:cognitoId/properties", getManagerProperties);
router.post("/", createManager);

export default router;
