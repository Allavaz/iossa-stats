export const renderer = {
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
