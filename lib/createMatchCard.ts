import matchCardTemplate from "./matchCardTemplate";
import fs from "fs";
import { Cluster } from "puppeteer-cluster";

let cluster;

export default async function createMatchCard(data, temp = false) {
  let image = null;
  if (!cluster)
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 5,
      puppeteerOptions: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--single-process"
        ]
      }
    });
  await cluster.execute(async ({ page }) => {
    const template = await matchCardTemplate(data);
    await page.setViewport({
      width: 670,
      height: 480
    });
    await page.setContent(template, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ path: "./styles/matchCardStyle.css" });
    // Wait until all images and fonts have loaded
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll("img"));
      await Promise.all([
        document.fonts.ready,
        ...selectors.map(img => {
          if (img.complete) return;
          return new Promise(resolve => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve);
          });
        })
      ]);
    });
    const container = await page.$(".container");
    const boundingBox = await container.boundingBox();
    let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}`;
    if (!fs.existsSync(dir) && !temp) {
      fs.mkdirSync(dir, { recursive: true });
    }
    image = await page.screenshot({
      path: !temp
        ? `./.cache/matchcards/${
            process.env.DB_COLLECTION
          }/${data._id.toString()}.png`
        : null,
      clip: {
        x: 0,
        y: 0,
        width: 670,
        height: Math.round(boundingBox.height)
      }
    });
    await page.close();
  });
  return image;
}
