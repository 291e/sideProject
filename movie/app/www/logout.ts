import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", "session=; Max-Age=0; Path=/");
  res.writeHead(302, { Location: "/" });
  res.end();
}
