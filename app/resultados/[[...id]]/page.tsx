import Results from "./results";
import { getMatches } from "../../../lib/getFromDB";
import Selector from "../../../components/selector";
import {
  getAllQueries,
  getCategory,
  getTemporada,
  temporadaActual
} from "../../../utils/Utils";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }) {
  let id = "";

  if (params.id) {
    id = params.id[0];
  } else id = temporadaActual();

  if (getAllQueries().includes(id)) {
    return {
      title: `Resultados ${getCategory(id)}`
    };
  }
}

export default async function Resultados({ params, searchParams }) {
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

  const matches = await getMatches(id);

  return (
    <div className="flex flex-col gap-y-4">
      <Selector context="resultados" temporada={temporada} />
      <Results matches={matches} category={category} pagina={page} />
    </div>
  );
}
