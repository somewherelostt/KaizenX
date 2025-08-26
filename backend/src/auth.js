import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const register = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      console.log("Missing required fields:", { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email already exists:", email);
      return res.status(400).json({ error: "Email already in use" });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    
    console.log("User registered successfully:", { username, email });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
};

export const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
