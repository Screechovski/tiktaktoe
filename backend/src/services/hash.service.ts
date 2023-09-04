import bcrypt from "bcrypt";

export async function createHash(value: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(value, saltRounds);
  return hashedPassword;
}

export async function comparePasswords(
  value: string,
  hashedValue: string
): Promise<boolean> {
  return await bcrypt.compare(value, hashedValue);
}
