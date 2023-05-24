import Card from "./card";

export default function Modal({ children }) {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
      <div className="flex h-fit w-fit max-w-6xl">
        <Card>{children}</Card>
      </div>
    </div>
  );
}
