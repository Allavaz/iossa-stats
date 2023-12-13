import Card from "../../components/commons/card";
import { GetServerSideProps } from "next";
import { getRules } from "../../lib/getFromDB";
import RulesEditor from "./editor";
import RulesPreview from "./preview";

export const getServerSideProps: GetServerSideProps = async context => {
  const { rules, date } = await getRules();
  let editable = false;
  if (context.params.id?.[0] === process.env.ENDPOINT) {
    editable = true;
  }
  return {
    props: { rules, date: date.toISOString(), editable }
  };
};

export default function Rules({ rules, date, editable }) {
  return (
    <Card>
      <div className="flex flex-col gap-y-4">
        {editable ? (
          <RulesEditor defaultValue={rules} />
        ) : (
          <RulesPreview rules={rules} date={date} />
        )}
      </div>
    </Card>
  );
}
