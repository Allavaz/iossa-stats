interface Props {
  children: any;
  onClick: (...args: any) => any;
  style?: any;
  disabled?: boolean;
}

export default function Button(props: Props) {
  return (
    <button
      className="w-fit rounded-lg border border-neutral-200 bg-white p-2 shadow-lg transition-colors hover:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 disabled:dark:text-neutral-500"
      style={props.style}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
