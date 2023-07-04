import Card from "../components/commons/card";
import Button from "../components/commons/button";
import Title from "../components/commons/title";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="m-auto w-fit">
      <Card>
        <div className="flex flex-col items-center gap-y-4">
          <Title>Error 404 - Página No Encontrada</Title>
          <img src="/404.jpg" alt="Error 404" />
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
