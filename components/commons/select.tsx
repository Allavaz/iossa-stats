interface Props {
  children: any;
  style?: any;
  onChange: (...args: any) => any;
  defaultValue?: any;
}

export default function Select(props: Props) {
  return (
    <select
      className="w-fit rounded-lg border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
      onChange={props.onChange}
      style={props.style}
      defaultValue={props.defaultValue}
    >
      {props.children}
    </select>
  );
}
