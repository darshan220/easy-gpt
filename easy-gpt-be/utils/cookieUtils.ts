// utils/cookieUtils.ts
import { Response } from "express";

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    domain: "localhost",
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
};

