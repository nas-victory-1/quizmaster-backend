import UserModel from "./user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(hashedPassword);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log(newUser);

    const { password: _, ...newUserWithoutPassword } = newUser.toObject();

    console.log(newUserWithoutPassword);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUserWithoutPassword,
    });
    return;
    
  } catch (error: any) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      res.status(401).json({
        success: false,
        message: "This email does not have an account",
      });
      return;
    }

    const correctUser = await bcrypt.compare(password, existingUser.password);
    if (!correctUser) {
      res.status(401).json({
        success: false,
        message: "Incorrect passsword",
      });
      return;
    }

    if (!process.env.SECRET_KEY) {
      res.status(400).json({
        success: false,
        message: "Token not set",
      });
      return;
    }

    //generating the token
    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    const { password: _, ...userWithoutPassword } = existingUser.toObject();

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
      data: userWithoutPassword,
    });
    return;
  } catch (error) {
    console.error("Error is ", error);
  }
};