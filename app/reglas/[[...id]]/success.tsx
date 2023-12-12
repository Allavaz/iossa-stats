import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import { useRouter } from "next/router";

export default function SuccessRules() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-y-6">
      <Title>Editar reglas</Title>
      <FontAwesomeIcon
        className="text-[100px] text-neutral-500 dark:text-neutral-400"
        icon={faCheckCircle}
      />
      <div className="text-lg">Reglas actualizadas correctamente.</div>
      <Button onClick={() => router.push("/reglas")}>Ver reglas</Button>
    </div>
  );
}
