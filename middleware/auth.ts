import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
const { PRIVATE_KEY } = process.env;

interface IHaveUser extends Request {
  user?: any;
}
export default function (req: IHaveUser, res: Response, next: NextFunction) {
  const token: any = req.header("user-token");

  if (!token)
    return res.status(403).json({
      status: `Failed`,
      message: `Not allowed`,
    });
  try {
    const decoded = jwt.verify(token, PRIVATE_KEY!);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      status: `Failed`,
      message: `Invalid token`,
    });
  }
}
