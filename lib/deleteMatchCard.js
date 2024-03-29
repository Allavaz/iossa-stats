import fs from "fs";

export default function deleteMatchCard(id) {
  let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}/${id}.png`;
  if (fs.existsSync(dir)) {
    fs.unlinkSync(dir);
  }
}
