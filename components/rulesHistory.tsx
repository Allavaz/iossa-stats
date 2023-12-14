import { useState } from "react";
import Title from "./commons/title";
import { fechaHora } from "../utils/Utils";
import { marked } from "marked";
import { renderer } from "../utils/marked-renderer";
import { diffLines } from "diff";

function DiffElement({ part }) {
  const parsedMD = marked.parse(part.value) as string;
  const diffClasses = part.added
    ? "dark:bg-green-800 bg-green-300"
    : part.removed
    ? "dark:bg-red-900 bg-red-300"
    : "";
  return (
    <div
      className={diffClasses}
      dangerouslySetInnerHTML={{ __html: parsedMD }}
    />
  );
}

export default function RulesHistory({ rules }) {
  const [selectedRule, setSelectedRule] = useState(0);
  const currentRule = rules[0];

  marked.use({ renderer });

  function RuleItem({ rule, index }) {
    const selected = index === selectedRule;
    const bg = selected && "bg-neutral-100 dark:bg-neutral-800";
    return (
      <div
        className={`cursor-pointer border-b border-neutral-200 p-2 text-right last:border-0 dark:border-neutral-700 ${bg} flex flex-col items-end gap-1`}
        onClick={() => setSelectedRule(index)}
      >
        <div className="text-lg font-bold">{rule.ip}</div>
        <div className="text-sm italic text-neutral-500 dark:text-neutral-400">
          {fechaHora(rule.date)}
        </div>
        {index === 0 && (
          <div className="w-fit rounded border border-cyan-300 bg-cyan-500 p-1 text-xs text-white dark:border-cyan-600 dark:bg-cyan-800">
            Actual
          </div>
        )}
      </div>
    );
  }

  const diff = diffLines(rules[selectedRule].rules, currentRule.rules);

  return (
    <div className="flex flex-col gap-y-4">
      <Title>Historial de ediciones</Title>
      <div className="flex flex-wrap-reverse gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 sm:flex-nowrap">
        <div className="w-full overflow-y-auto pr-2">
          {diff.map((part, i) => (
            <DiffElement key={i} part={part} />
          ))}
        </div>
        <div className="flex w-full flex-col gap-y-2 sm:w-52">
          <Title>Versiones</Title>
          <div className="h-fit w-full overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700">
            {rules.map((rule, i) => (
              <RuleItem key={rule.date} rule={rule} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
