import express from "express";
import { getTenant, createTenant } from "../controllers/tenantControllers";

const router = express.Router();

// The userId that we pass on the frontend represents the cognitoId/sub
router.get("/:cognitoId", getTenant);
router.post("/", createTenant);

export default router;
