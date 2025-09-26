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

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
      return;
    }

    const correctPassword = await bcrypt.compare(password, existingUser.password);
    if (!correctPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
      return;
    }

    if (!process.env.SECRET_KEY) {
      res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email }, 
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = existingUser.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Send token in response body (frontend stores in localStorage)
      data: userWithoutPassword,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};