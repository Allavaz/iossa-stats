export default function MatchIcon({ event }) {
  switch (event) {
    case "GOAL":
      return (
        <img
          src="/matchicons/pelota.png"
          id="pelota"
          alt="Gol"
          height="15px"
          style={{ marginRight: "5px", verticalAlign: "text-top" }}
        ></img>
      );
    case "OWN GOAL":
      return (
        <img
          src="/matchicons/gc.png"
          id="pelota"
          alt="Gol en Contra"
          height="15px"
          style={{ marginRight: "5px", verticalAlign: "text-top" }}
        ></img>
      );
    case "YELLOW CARD":
      return (
        <img
          src="/matchicons/yellowcard.png"
          alt="Tarjeta Amarilla"
          height="15px"
          style={{ marginRight: "5px", verticalAlign: "text-top" }}
        ></img>
      );
    case "RED CARD":
      return (
        <img
          src="/matchicons/redcard.png"
          alt="Tarjeta Roja"
          height="15px"
          style={{ marginRight: "5px", verticalAlign: "text-top" }}
        ></img>
      );
    case "SECOND YELLOW":
      return (
        <img
          src="/matchicons/doubleyellowcard.png"
          alt="Doble Amarilla"
          height="15px"
          style={{ marginRight: "5px", verticalAlign: "text-top" }}
        ></img>
      );
    default:
      return null;
  }
}
