import Card from "../components/ui/card";
import Button from "../components/ui/button";
import Title from "../components/ui/title";

export default function NotFound() {
  return (
    <div className="m-auto w-fit">
      <Card>
        <div className="flex flex-col items-center gap-y-4">
          <Title>Error 404 - Página No Encontrada</Title>
          <img src="/404.jpg" alt="Error 404" />
          <Button href="/">Volver al inicio</Button>
        </div>
      </Card>
    </div>
  );
}
