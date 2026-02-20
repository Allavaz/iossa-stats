import { getPositions } from "../../../../lib/getFromDB";

export async function GET(request: Request, props) {
  const params = await props.params;
  const id = params.id;
  if (!id) {
    return Response.json("Missing id");
  }
  return Response.json(await getPositions(params.id));
}
