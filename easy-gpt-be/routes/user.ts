import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { clearAuthCookie, setAuthCookie } from "../utils/cookieUtils";
import { appConfig } from "../config/app.config";
const prisma = new PrismaClient();
const router = Router();

router.post("/signup", async (req: any, res: any) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    const token = jwt.sign({ userId: user.id }, appConfig.jwtSecret, {
      expiresIn: "24h",
    });
    setAuthCookie(res, token);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, appConfig.jwtSecret, {
      expiresIn: "24h",
    });
    setAuthCookie(res, token);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

router.get("/me", async (req: any, res: any) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, appConfig.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
