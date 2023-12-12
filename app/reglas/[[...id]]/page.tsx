import Card from "../../../components/ui/card";
import { getRules } from "../../../lib/getFromDB";
import RulesEditor from "./editor";
import RulesPreview from "./preview";

export default async function RulesPage({ params }) {
  const { rules, lastEdit } = await getRules();

  let editable = false;
  if (params.id?.[0] == process.env.ENDPOINT) {
    editable = true;
  }

  return (
    <Card>
      <div className="flex flex-col gap-y-4">
        {editable ? (
          <RulesEditor defaultValue={rules} />
        ) : (
          <RulesPreview rules={rules} lastEdit={lastEdit} />
        )}
      </div>
    </Card>
  );
}
