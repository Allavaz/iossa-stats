import Card from "../../components/commons/card";
import { GetServerSideProps } from "next";
import { getRules } from "../../lib/getFromDB";
import RulesEditor from "../../components/rulesEditor";
import RulesPreview from "../../components/rulesPreview";
import RulesHistory from "../../components/rulesHistory";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async context => {
  const props: any = {};
  if (context.params.id?.[0] === process.env.ENDPOINT) {
    props.editable = true;
    if (context.params.id?.[1] === "history") {
      props.history = true;
      props.allRules = await getRules();
    } else {
      const { rules } = await getRules(true);
      props.rules = rules;
    }
  } else {
    const { rules, date } = await getRules(true);
    props.rules = rules;
    props.date = date;
  }
  return { props };
};

function ComponentSwitch({ rules, date, editable, history, allRules }) {
  if (editable) {
    if (history) {
      return <RulesHistory rules={allRules} />;
    } else {
      return (
        <Card>
          <div className="flex flex-col gap-y-4">
            <RulesEditor defaultValue={rules} />
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

export default function Rules({ rules, date, editable, history, allRules }) {
  return (
    <>
      <Head>
        <title>Reglas | IOSoccer Sudamérica</title>
        <meta name="title" content={`Reglas | IOSoccer Sudamérica`} />
        <meta name="description" content={`Reglas IOSoccer Sudamérica`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Reglas | IOSoccer Sudamérica`} />
        <meta
          property="og:description"
          content={`Reglas IOSoccer Sudamérica`}
        />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <ComponentSwitch
        rules={rules}
        date={date}
        editable={editable}
        history={history}
        allRules={allRules}
      />
    </>
  );
}
