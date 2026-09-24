import { ImageResponse } from "@vercel/og";
import { readFileSync } from "fs";
import path from "path";
import fs from "fs";
import { Match } from "../types";
import { buildMatchCard } from "./matchCardElements";

const publicPath = path.resolve("./public");

const interFont = readFileSync(path.join(publicPath, "fonts", "Inter-Regular.ttf"));
const poppinsFont = readFileSync(
  path.join(publicPath, "fonts", "Poppins-Bold.ttf")
);

export default async function createMatchCard(data: Match, temp = false) {
  const { element, width, height } = await buildMatchCard(data);

  const image = new ImageResponse(element as any, {
    width,
    height,
    fonts: [
      { name: "Inter", data: interFont, weight: 400, style: "normal" },
      { name: "Poppins", data: poppinsFont, weight: 700, style: "normal" }
    ]
  });

  const buffer = Buffer.from(await image.arrayBuffer());

  if (!temp) {
    const dir = `./.cache/matchcards/${process.env.DB_COLLECTION}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${data._id.toString()}.png`, buffer);
  }

  return buffer;
}
