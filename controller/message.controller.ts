import { Message } from "../models/message";
import encrypt from "../utils/encryption";
import { Request, Response } from "express";

interface IHaveRoom extends Request {
  roomId?: any;
}
const onGetMessage = async (req: IHaveRoom, res: Response) => {
  const message = await Message.findOne({
    roomCode: { $regex: req.roomId, $options: "i" },
  });
  if (!message)
    return res.status(404).json({
      status: "failed",
      message: "no message",
    });

  res.status(200).json({
    status: `success`,
    data: message,
  });
};

const onSendMessage = async (req: Request, res: Response) => {
  let newMessage = new Message({
    messages: [],
    roomCode: req.body.id,
  });
  await newMessage.save();
  return res.status(200).json({
    status: "success",
    data: newMessage,
  });
};
const onUpdateMessage = async (req: IHaveRoom, res: Response) => {
  let encryptedMessage = encrypt(req.body.message)
  const message = await Message.updateOne(
    {roomCode: { $regex: req.roomId, $options: "i" } },
    {
      $push: {
        messages: {
          message: encryptedMessage,
          from: req.body.from,
          time: req.body.time,
          date: req.body.date,
          isRead: req.body.isRead
        },
      },
    }
  );
  return res.status(200).json({
    status: "success",
    data: message,
  });
};


// const getAllUserRoomMessages = async (req:IHaveUser, res:Response)=>{
//     const message = await Message.find({Room_id:{$regex:req.user.id, $options:"i"}})
//     return res.status(200).json({
//         status:"success",
//         data:message
//     })
// }


export { onGetMessage, onSendMessage, onUpdateMessage };
