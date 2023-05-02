interface Props {
  children: any;
  style?: any;
}

export default function Title(props: Props) {
  return (
    <div
      className="w-full text-xl font-bold text-neutral-600 dark:text-neutral-400 uppercase"
      style={props.style}
    >
      {props.children}
    </div>
  );
}
