import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: number;
  role: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = auth.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "change_me");
    if (typeof verified === "object" && verified && "sub" in verified && "role" in verified) {
      const payload = verified as unknown as JwtPayload;
      req.user = { id: payload.sub, role: payload.role };
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
