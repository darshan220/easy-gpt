import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../config/openaiConfig";
import { clearAuthCookie, setAuthCookie } from "../utils/cookieUtils";
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    console.log(token,"tokendddadadadada");
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

  // Input validation
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    console.log(token,"token");
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
  console.log(req.cookies,"reqreqreq");
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
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
