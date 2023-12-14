import updateRules from "../../lib/updateRules";
import requestIp from "request-ip";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        const ip = requestIp.getClientIp(req) || "127.0.0.1";
        const data = { rules: req.body.rules, ip, date: new Date() };
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
