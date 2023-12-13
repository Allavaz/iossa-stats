import updateRules from "../../lib/updateRules";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        const ip = req.headers["x-forwarded-for"] || "127.0.0.1";
        const data = { ...req.body.rules, ip };
        await updateRules(data);
        return res.status(200).json({ message: "Reglas actualizadas" });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error al actualizar las reglas" });
      }
    } else {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
  }
}
