import Head from "next/head";
import Title from "../components/commons/title";
import Card from "../components/commons/card";
import Button from "../components/commons/button";
import { useRouter } from "next/router";

export default function Error404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Error 404 | IOSoccer Sudamérica</title>
      </Head>
      <div className="m-auto w-fit">
        <Card>
          <div className="flex flex-col items-center gap-y-4">
            <Title>Error 404 - Página No Encontrada</Title>
            <img src="/404.jpg" alt="Error 404" />
            <Button onClick={_ => router.push("/")}>Volver al inicio</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
