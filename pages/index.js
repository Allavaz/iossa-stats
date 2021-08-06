import Head from 'next/head';
import { getMatches, getManyPositions } from '../lib/getFromDB';
import Matches from '../components/matches';
import MiniPositions from '../components/miniPositions';

const minitables = [
  {torneo: "d1t7", header: "Liga D1 T7"},
  {torneo: "d2t7", header: "Liga D2 T7"},
  {torneo: "america21r", header: "Copa America '21 - Regular"},
  {torneo: "sd1t7", header: "Superliga D1 T7" },
  {torneo: "maradeit7a", header: "Copa Maradei T7 - Grupo A"},
  {torneo: "maradeit7b", header: "Copa Maradei T7 - Grupo B"},
  {torneo: "maradeit7c", header: "Copa Maradei T7 - Grupo C"},
  {torneo: "maradeit7d", header: "Copa Maradei T7 - Grupo D"},
];

export async function getServerSideProps(context) {
  let matches = await getMatches('20');
  let torneos = []
  for (let i in minitables) {
    torneos.push(minitables[i].torneo);
  }
  let tablas = await getManyPositions(torneos);
  return (
    { props: { 
      matches: JSON.parse(JSON.stringify(matches)),
      tablas: JSON.parse(JSON.stringify(tablas))
    } }
  )
}

export default function Home({ matches, tablas }) {
  return (
    <>
      <Head>
        <title>IOSoccer Sudamérica</title>
        <meta name="title" content="IOSoccer Sudamérica" />
        <meta name="description" content="Resultados y estadísticas de la comunidad sudamericana de IOSoccer." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="IOSoccer Sudamérica" />
        <meta property="og:description" content="Resultados y estadísticas de la comunidad sudamericana de IOSoccer." />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content='IOSoccer Sudamérica' />
      </Head>
      <div className='colCon'>
        <Matches matches={matches} />
        <div className='flexTableDiv' style={{flexGrow: 1}}>
          {tablas.map((item, index) => (
            <MiniPositions teams={item} key={index} header={minitables[index].header} unificada={minitables[index].torneo.startsWith('sd')}></MiniPositions>
          ))}
        </div>
      </div>
    </>
  )
}
