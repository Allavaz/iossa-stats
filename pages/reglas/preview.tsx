import { marked } from "marked";
import { fechaHora } from "../../utils/Utils";
import { renderer } from "./renderer";

export default function RulesPreview({ rules, date }) {
  marked.use({ renderer });
  const parsedMD = rules ? (marked.parse(rules) as string) : "";

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: parsedMD }} />
      <div className="my-6 w-full border-t border-dashed border-neutral-300 dark:border-neutral-600" />
      <div className="flex justify-end text-sm italic text-neutral-500 dark:text-neutral-400">
        Última edición: {fechaHora(date)}
      </div>
    </div>
  );
}
