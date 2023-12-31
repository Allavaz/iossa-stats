import { getPositions } from "../../../../lib/getFromDB";

export async function GET(request: Request, { params }) {
  const id = params.id;
  if (!id) {
    return Response.json("Missing id");
  }
  return Response.json(await getPositions(params.id));
}
