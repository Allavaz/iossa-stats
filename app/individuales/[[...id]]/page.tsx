import IndividualStats from "./individualStats";
import { getPlayers } from "../../../lib/getFromDB";
import Selector from "../../../components/selector";
import {
  getAllQueries,
  getTemporada,
  getCategory,
  temporadaActual
} from "../../../utils/Utils";
import { notFound } from "next/navigation";

export async function generateMetadata(props) {
  const params = await props.params;
  let id = "";

  if (params.id) {
    id = params.id[0];
  } else id = temporadaActual();

  if (getAllQueries().includes(id)) {
    return {
      title: `Individuales ${getCategory(id)}`
    };
  }
}

export default async function Individuales(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  let id = "";

  if (params.id) {
    id = params.id[0];
  } else id = temporadaActual();

  let category = "";

  if (getAllQueries().includes(id)) {
    category = getCategory(id);
  } else {
    notFound();
  }

  const temporada = getTemporada(id);

  let page = 0;
  if (searchParams.page) {
    page = parseInt(searchParams.page) - 1;
  }

  const players = await getPlayers(id);

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <Selector context="individuales" temporada={temporada} />
        <IndividualStats players={players} category={category} pagina={page} />
      </div>
    </>
  );
}
