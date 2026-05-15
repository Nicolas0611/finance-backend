// src/services/authService.ts
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "@/config/app";
import { userRepository } from "@/repositories/userRepository";
import { AppError } from "@/utils/AppError";
import { RegisterInput, LoginInput } from "@/validators/authValidators";

const generateToken = (userId: string): string =>
  jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  });

export const authService = {
  register: async ({ name, email, password }: RegisterInput) => {
    const existing = await userRepository.findByEmailWithPassword(email);
    if (existing) throw new AppError("Email already in use", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user.id);

    return { user, token };
  },

  login: async ({ email, password }: LoginInput) => {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw new AppError("Invalid email or password", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    // Strip password before returning
    const { password: _pw, ...safeUser } = user;
    const token = generateToken(user.id);

    return { user: safeUser, token };
  },
};
