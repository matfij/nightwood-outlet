import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async hash(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buffer.toString()}.${salt}`;
  }

  static async compare(hashed: string, target: string): Promise<boolean> {
    const [hash, salt] = hashed.split('.');
    const buffer = (await scryptAsync(target, salt, 64)) as Buffer;
    return buffer.toString() === hash;
  }
}
