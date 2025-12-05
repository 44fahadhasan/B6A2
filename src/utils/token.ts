import jwt from "jsonwebtoken";
import config from "../config";

interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Generate Tokens
export const generateTokens = (payload: IUser) => {
  const token = jwt.sign(
    payload, // Payload
    config.jwt.token_secret as string, // Secret key
    { expiresIn: config.jwt.token_expires_in } // Expiration time
  );

  return token;
};

// Verify Token
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt.token_secret as string);
    return decoded;
  } catch (err) {
    return null;
  }
};
