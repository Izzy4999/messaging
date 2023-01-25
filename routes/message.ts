import { Router } from "express";
import {  onGetMessage, onSendMessage, onUpdateMessage } from "../controller/message.controller";
import auth from "../middleware/auth";
import roomCode from "../middleware/roomId"

const router =Router()

router.get('/',[auth,roomCode],onGetMessage)
// router.get("/all",[auth,],getAllUserRoomMessages)
router.post('/',auth,onSendMessage)
router.post("/update",[auth,roomCode], onUpdateMessage)

export default router