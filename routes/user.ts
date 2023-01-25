import { Router } from "express";
import auth from "../middleware/auth";
import {
  onLogin,
  onSignUp,
  onDelete,
  onGetUser,
  onGetAllUser,
  onRecieveRequest,
  onAcceptRequest,
  onRejectRequest,
  onGetUpdatedUser,
} from "../controller/user.controller";
const router = Router();

router.get("/me", auth, onGetUser);
router.get("/all", auth, onGetAllUser);
router.post("/signup", onSignUp);
router.post("/login", onLogin);
router.post("/request", auth, onRecieveRequest);
router.post("/A_request", auth, onAcceptRequest);
router.post("/r_request", auth, onRejectRequest);
router.get("/:id", auth, onGetUpdatedUser);
router.delete("/me", auth, onDelete);

export default router;
