import { marked } from "marked";
import { fecha } from "../../utils/Utils";

export default function RulesPreview({ rules, lastEdit }) {
  const renderer = {
    heading(text, level) {
      const classes = {
        1: "mb-3 mt-2 text-2xl font-bold",
        2: "mb-3 mt-2 text-xl font-bold",
        3: "text-lg font-bold",
        4: "text-base font-bold",
        5: "text-sm font-bold"
      };
      return `<h${level} class="${classes[level]}">${text}</h${level}>`;
    },
    paragraph(text) {
      return `<p class="mb-3">${text}</p>`;
    },
    list(body, ordered) {
      const type = ordered ? "ol" : "ul";
      const styleType = ordered ? "list-decimal" : "list-disc";
      return `<${type} class="list-inside ${styleType} mb-3">${body}</${type}>`;
    },
    hr() {
      return `<hr class="my-6 border-neutral-300 dark:border-neutral-600" />`;
    },
    em(text) {
      return `<em class="italic">${text}</em>`;
    }
  };

  marked.use({ renderer });

  const parsedMD = marked.parse(rules) as string;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: parsedMD }} />
      <div className="my-6 w-full border-t border-dashed border-neutral-300 dark:border-neutral-600" />
      <div className="flex justify-end text-sm italic text-neutral-500 dark:text-neutral-400">
        Última edición: {fecha(lastEdit)}
      </div>
    </div>
  );
}
