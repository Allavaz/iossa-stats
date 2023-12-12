interface Props {
  children: any;
  style?: any;
}

export default function Title(props: Props) {
  return (
    <div
      className="w-full font-heading text-xl font-bold uppercase text-neutral-600 dark:text-neutral-400"
      style={props.style}
    >
      {props.children}
    </div>
  );
}
