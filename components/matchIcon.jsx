export default function MatchIcon({ event }) {
  switch (event) {
    case "GOAL":
      return (
        <img
          className="h-5 dark:invert"
          src="/matchicons/pelota.png"
          alt="Gol"
        />
      );
    case "OWN GOAL":
      return (
        <img
          className="h-5 dark:invert"
          src="/matchicons/gc.png"
          alt="Gol en Contra"
        />
      );
    case "YELLOW CARD":
      return (
        <img
          className="h-5"
          src="/matchicons/yellowcard.png"
          alt="Tarjeta Amarilla"
        />
      );
    case "RED CARD":
      return (
        <img className="h-5" src="/matchicons/redcard.png" alt="Tarjeta Roja" />
      );
    case "SECOND YELLOW":
      return (
        <img
          className="h-5"
          src="/matchicons/doubleyellowcard.png"
          alt="Doble Amarilla"
        />
      );
    default:
      return null;
  }
}
