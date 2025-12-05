import bcrypt from "bcryptjs";

// Hash a value
export const createHash = async (
  value: string,
  salt: number = 10
): Promise<string> => {
  try {
    return await bcrypt.hash(value, salt);
  } catch (err) {
    throw new Error(`Error hashing: ${(err as Error).message}`);
  }
};

// Compare a value with a hashed value
export const compareHash = async (
  value: string,
  hashed: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(value, hashed);
  } catch (err) {
    throw new Error(`Error comparing hash: ${(err as Error).message}`);
  }
};
