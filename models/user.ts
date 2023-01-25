import mongoose, { ObjectId } from "mongoose";
import { UserSign, LogUser } from "../interfaces/userInterface";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const { PRIVATE_KEY } = process.env;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 6,
    max: 220,
  },
  lastName: {
    type: String,
    required: true,
    min: 6,
    max: 220,
  },
  DOB: {
    type: Date,
  },
  password: {
    type: String,
    min: 6,
    max: 12,
    required: true,
  },
  userName: {
    type: String,
    min: 4,
    max: 13,
  },
  DOC: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  friends: {
    type: Array,
    default: [],
  },
  requests: {
    type: Array,
    default: [],
  },
  sentRequest: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

function generateAuthToken(
  email: string,
  id: mongoose.Types.ObjectId,
  userName?: string
): string {
  const token: string = jwt.sign(
    {
      id,
      email,
      userName,
    },
    PRIVATE_KEY!
  );
  return token;
}

function validate(user: UserSign): any {
  const schema = Joi.object({
    firstName: Joi.string().required().min(3).max(220),
    lastName: Joi.string().required().min(3).max(220),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(6)
      .max(12),
    repeat_password: Joi.ref("password"),
    DOB: Joi.date(),
    DOC: Joi.date(),
    userName: Joi.string().required().min(4).max(12),
  });

  return schema.validate(user);
}

function validateLogin(user: LogUser): any {
  const schema = Joi.object({
    userName: Joi.string().min(4).max(50),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(6)
      .max(12),
  });
  return schema.validate(user);
}

export { User, validate, validateLogin, generateAuthToken };
