import User from "../models/user.js";
import { userSchema } from "../validation/userRegister.js";
import { loginSchema } from "../validation/userLogin.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  //validate user inputs
  if (error) {
    return res.status(400).json({
      message: "Validation error: ",
      details: error.details
    });
  }

  try {
    //check user already exist
    const existUser = await User.findOne({ email: value.email });
    if (existUser) {
      return res.status(500).json({ message: "user already exist !" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.password, salt);

    //create new user
    const newUser = await User.create({ ...value, password: hashedPassword });
    res.status(201).json({
      message: "Register successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

//login
export const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation error", details: error.details });
  }

  try {
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email,  role: user.role });

    // Set token in HTTP-only cookie
    res.cookie("SDL_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    //login successfully
    res.status(200).json({
      message: "Login Successfully !",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error",
    });
  }
};

//logout
export const logout = (req, res) => {
  res.clearCookie("SDL_token");
  res.status(200).json({ message: "Logged out successfully!" });
};

//auth me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
