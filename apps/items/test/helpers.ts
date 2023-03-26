import { sign } from "jsonwebtoken";

export const getCookies = (): string[] => {
  const token = sign(
    {
      id: "jf2j34fj02",
      email: "my@mail.net",
    },
    process.env.JWT_KEY!
  );
  const sessionString = JSON.stringify({ jwt: token });
  const sessionBase64 = Buffer.from(sessionString).toString("base64");
  return [`session=${sessionBase64}`];
};
