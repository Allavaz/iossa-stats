import { isAdmin } from "@/auth";
import { logoFilenameExists } from "@/lib/getFromDB";
import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const cdnPath = process.env.CDN_CLUBS_PATH;
  if (!cdnPath)
    return new Response("CDN_CLUBS_PATH not configured", { status: 500 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const shortname = formData.get("shortname") as string | null;

  if (!file || !shortname)
    return new Response("Missing file or shortname", { status: 400 });

  const base = shortname.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!base) return new Response("Invalid shortname", { status: 400 });

  let logofilename = `${base}.png`;
  let suffix = 1;
  while (await logoFilenameExists(logofilename)) {
    logofilename = `${base}${suffix}.png`;
    suffix++;
  }

  const tempPath = join("/tmp", `${randomUUID()}.png`);
  const destPath = join(cdnPath, logofilename);

  const buffer = new Uint8Array(await file.arrayBuffer());
  await writeFile(tempPath, buffer);

  try {
    await execFileAsync(process.env.IMAGEMAGICK_PATH || "magick", [
      tempPath,
      "-trim",
      "-resize",
      "128x128",
      "-background",
      "transparent",
      "-gravity",
      "center",
      "-extent",
      "128x128",
      destPath
    ]);
  } finally {
    await unlink(tempPath).catch(() => {});
  }

  return Response.json({ logofilename });
}
