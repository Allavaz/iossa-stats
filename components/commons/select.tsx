interface Props {
  children: any;
  style?: any;
  onChange: (...args: any) => any;
  defaultValue?: any;
}

export default function Select(props: Props) {
  return (
    <select
      className="p-2 border rounded-lg border-neutral-200 shadow-lg w-fit bg-white dark:bg-neutral-900 dark:border-neutral-700"
      onChange={props.onChange}
      style={props.style}
      defaultValue={props.defaultValue}
    >
      {props.children}
    </select>
  );
}
