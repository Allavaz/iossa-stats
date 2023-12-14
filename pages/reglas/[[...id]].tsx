import Card from "../../components/commons/card";
import { GetServerSideProps } from "next";
import { getRules, getRulesHistory } from "../../lib/getFromDB";
import RulesEditor from "../../components/rulesEditor";
import RulesPreview from "../../components/rulesPreview";
import RulesHistory from "../../components/rulesHistory";

export const getServerSideProps: GetServerSideProps = async context => {
  let editable = false;
  let history = false;
  if (context.params.id?.[0] === process.env.ENDPOINT) {
    const allRules = await getRulesHistory();
    const rulesSerialized = allRules.map(rule => ({
      ...rule,
      date: rule.date.toISOString()
    }));
    if (context.params.id?.[1] === "history") {
      history = true;
    }
    editable = true;
    return {
      props: { allRules: rulesSerialized, editable, history }
    };
  } else {
    const { rules, date } = await getRules();
    return {
      props: { rules, date: date.toISOString(), editable, history }
    };
  }
};

export default function Rules({ rules, date, editable, history, allRules }) {
  if (editable) {
    if (history) {
      return <RulesHistory rules={allRules} />;
    } else {
      return (
        <Card>
          <div className="flex flex-col gap-y-4">
            <RulesEditor defaultValue={allRules[0].rules} />
          </div>
        </Card>
      );
    }
  } else {
    return (
      <Card>
        <div className="flex flex-col gap-y-4">
          <RulesPreview rules={rules} date={date} />
        </div>
      </Card>
    );
  }
}
