interface Props {
  children: any;
  onClick: (...args: any) => any;
  style?: any;
  disabled?: boolean;
}

export default function Button(props: Props) {
  return (
    <button
      className="w-fit p-2 border rounded-lg border-neutral-200 shadow-lg bg-white dark:bg-neutral-900 dark:border-neutral-700 hover:bg-neutral-100 transition-colors dark:hover:bg-neutral-800"
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
