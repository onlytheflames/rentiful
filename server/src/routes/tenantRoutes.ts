import express from "express";
import {
  getTenant,
  createTenant,
  updateTenant,
  getCurrentResidences,
} from "../controllers/tenantControllers";

const router = express.Router();

// The userId that we pass on the frontend represents the cognitoId/sub
router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.post("/", createTenant);
router.get("/:cognitoId/properties", getCurrentResidences);

export default router;
