import puppeteer from "puppeteer";
import MatchCardTemplate from "./matchCardTemplate";
import fs from "fs";

export default async function createMatchCard(id) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let template = await MatchCardTemplate(id);
  await page.setViewport({
    width: 670,
    height: 480
  })
  await page.setContent(template, {waitUntil: 'domcontentloaded'});
  await page.addStyleTag({path: './styles/matchCardStyle.css'});
  // Wait until all images and fonts have loaded
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll("img"));
    await Promise.all([
      document.fonts.ready,
      ...selectors.map((img) => {
        // Image has already finished loading, let's see if it worked
        if (img.complete) {
          // Image loaded and has presence
          if (img.naturalHeight !== 0) return;
          // Image failed, so it has no height
          throw new Error("Image failed to load");
        }
        // Image hasn't loaded yet, added an event listener to know when it does
        return new Promise((resolve, reject) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", reject);
        });
      }),
    ]);
  });
  const container = await page.$('.container');
  const boundingBox = await container.boundingBox();
  let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
  let image = await page.screenshot({
    path: `./.cache/matchcards/${process.env.DB_COLLECTION}/${id}.png`,
    clip: {
      x: 0,
      y: 0,
      width: 670,
      height: Math.round(boundingBox.height)
    }
  });
  await browser.close();
  return image;
}