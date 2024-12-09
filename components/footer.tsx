import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitch,
  faYoutube,
  faDiscord
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const socials = [
    {
      link: "https://discord.me/iossudamerica",
      icon: faDiscord
    },
    {
      link: "https://www.youtube.com/@IOSoccerSudamerica",
      icon: faYoutube
    },
    {
      link: "https://www.twitch.tv/IOSSuda",
      icon: faTwitch
    }
  ];

  return (
    <div className="w-full">
      <div className="m-auto my-5 flex w-full max-w-6xl flex-col items-center justify-center gap-y-3 px-2 sm:p-0">
        <RectangleAd />
        <div className="my-6 w-full border-t border-dashed border-neutral-300 dark:border-neutral-600" />
        <div className="flex gap-x-3">
          {socials.map((item, index) => (
            <div key={index}>
              <a
                className="text-3xl text-neutral-400 transition-colors hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
              </a>
            </div>
          ))}
        </div>
        <p className="text-neutral-400 dark:text-neutral-600">
          Hecho con ♥ por Allavaz.
        </p>
      </div>
    </div>
  );
}
