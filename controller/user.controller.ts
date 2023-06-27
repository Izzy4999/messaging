import {
  generateAuthToken,
  User,
  validate,
  validateLogin,
} from "../models/user";
import { UserSign, LogUser } from "../interfaces/userInterface";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

interface IHaveUser extends Request {
  user?: any;
}

const onSignUp = async (req: Request, res: Response) => {

  const { error } = validate(req.body as UserSign);
  if (error)
    return res.status(400).json({
      status: `Failed`,
      message: error.details[0].message,
    });

  const existedUser = await User.findOne({ email: req.body.email });
  if (existedUser)
    return res.status(400).json({
      status: `failed`,
      message: `User already registered`,
    });
  const existedUserName = await User.findOne({ userName: req.body.userName });
  if (existedUserName)
    return res.status(400).json({
      status: `Failed`,
      message: `Username taken`,
    });
  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    userName: req.body.userName,
    DOB: req.body.DOB,
    email: req.body.email,
    friends: [],
    requests: [],
  });
  await user.save();
  const { firstName, lastName, userName, email, friends } = user;
  const token: string = generateAuthToken(email, user._id, userName);

  res.json({
    status: `Success`,
    data: {
      token,
      firstName,
      lastName,
      userName,
      email,
      friends,
    },
  });
};

const onLogin = async (req: Request, res: Response) => {  
  const { userName, password } = req.body as LogUser;

  const { error } = validateLogin(req.body);
  if (error)
    return res.status(401).json({
      status: `Failed`,
      message: error.details[0].message,
    });

  let userExist = await User.findOne({ email: userName });
  if (!userExist) {
    userExist = await User.findOne({ userName });
    if (!userExist)
      return res.status(400).json({
        status: `Failed`,
        message: `Invalid Username/Email or password`,
      });
  }


  const rightPassword = await bcrypt.compare(password, userExist.password); // Object is possibly 'null' (for userExist.password);
  if (!rightPassword)
    return res.status(400).json({
      status: `failed`,
      message: `Invalid Username/Email or password`,
    });

  const token: string = generateAuthToken(
    userExist.email!,
    userExist._id,
    userName
  );

  res.status(200).json({
    status: `Success`,
    data: {
      token,
      message: `Login Successful`,
      firstName: userExist.firstName,
      lastName: userExist.lastName,
      userName: userExist.userName,
      email: userExist.email,
    },
  });
};

const onDelete = async (req: IHaveUser, res: Response) => {
  const user = await User.findByIdAndDelete(req.user._id).select(
    "-_id -__v -password"
  );
  res.json({
    status: `Success`,
    user,
  });
};
const onGetUser = async (req: IHaveUser, res: Response) => {
  const user = await User.findById(req.user.id).select("-__v -password");
  res.json({
    status: `Success`,
    user,
  });
};
const onGetAllUser = async (req: IHaveUser, res: Response) => {
  const user = await User.find({$nor:[{$and:[{'email':req.user.email}]}]}).select("-__v -password");
  res.status(200).json({
    status: "Success",
    users: user,
  });
};
const onRecieveRequest = async (req: IHaveUser, res: Response) => {
  const userSendingRequest = await User.updateOne(
    { _id: req.user.id },
    {
      $push: {
        sentRequest: req.body.recievingRequest,
      },
    }
  );
  if (!userSendingRequest)
    return res.status(400).json({
      status: "failed",
      message: `User does not Exist`,
    });

  const userRecievingRequest = await User.updateOne(
    { _id: req.body.recievingRequest._id },
    { $push: { requests: req.body.sendingRequest } }
  );
  if (!userRecievingRequest)
    return res.status(400).json({
      status: "failed",
      message: `User does not Exist`,
    });
  return res.status(200).json({
    status: "success",
    data: { userSendingRequest, userRecievingRequest },
  });
};
const onAcceptRequest = async (req: IHaveUser, res: Response) => {
  const userAcceptingRequest = await User.updateOne(
    { _id: req.user.id },
    {
      $push: { friends: {friend:req.body.friend,roomCode:req.body.roomCode }},
      $pull: { requests: { _id: req.body.friend._id } },
    }
  );
  if (!userAcceptingRequest)
    return res.status(400).json({
      status: "failed",
      message: `User does not Exist`,
    });
  const userSentTheRequest = await User.updateOne(
    { _id: req.body.friend._id },
    {
      $push: { friends: {friend:req.body.acceptingUser ,roomCode:req.body.roomCode}},
      $pull: { sentRequest: { _id: req.body.acceptingUser._id } },
    }
  );
  if (!userSentTheRequest)
    return res.status(400).json({
      status: "failed",
      message: `User does not Exist`,
    });

  return res.status(200).json({
    status: "success",
    data: { userAcceptingRequest, userSentTheRequest },
  });
};
const onRejectRequest = async (req: IHaveUser, res: Response) => {
  const userSendingRequest = await User.updateOne(
    { _id: req.body.reciever._id },
    {
      $pull: {
        requests: { _id: req.body.sender._id },
      },
    }
  );
  if (!userSendingRequest)
    return res.status(400).json({
      status: "failed",
      message: `User does not Exist`,
    });
  const userRecievingRequest = await User.updateOne(
    { _id: req.body.sender._id },
    { $pull: { sentRequest: { _id: req.body.reciever._id } } }
  );
  if (!userRecievingRequest)
    return res.status(400).json({
      status: "failed",
      message: `User does not Exist`,
    });
  return res.status(200).json({
    status: "success",
    data: { userSendingRequest, userRecievingRequest },
  });
};
const onGetUpdatedUser = async(req:IHaveUser,res:Response)=>{
  const user = await User.findOne({_id:req.params.id})
  if(!user) return res.status(400).json({
    status: "failed",
    message: `User does not Exist`,
  });
  res.status(200).json({
    status: "success",
    data: user
  });
}

export {
  onSignUp,
  onLogin,
  onDelete,
  onGetUser,
  onGetAllUser,
  onRecieveRequest,
  onAcceptRequest,
  onRejectRequest,
  onGetUpdatedUser
};
