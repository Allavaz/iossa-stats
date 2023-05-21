interface Props {
  children: any;
  onClick: (...args: any) => any;
  style?: any;
  disabled?: boolean;
}

export default function Button(props: Props) {
  return (
    <button
      className="w-fit rounded-lg border border-neutral-200 bg-white p-2 shadow-lg transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
