import { getTeamLogo } from '../utils/Utils';
import RadarG from './radarG';

function getPosColor(pos) {
	switch (pos) {
		case 'GK':
			return '#f2c350';
		case 'LB':
			return '#36A2EB';
		case 'RB':
			return '#36A2EB';
		case 'CB':
			return '#36A2EB';
		case 'LM':
			return '#3da33b';
		case 'RM':
			return '#3da33b';
		case 'CM':
			return '#3da33b';
		case 'CF':
			return '#FF6384';
		case 'LW':
			return '#FF6384';
		case 'RW':
			return '#FF6384';
		default:
			return '#ff9800';
	}
}

export default function PlayerCard({ statsAll, statsLast15, steamInfo }) {
  let positions = [];

	for (let i in statsAll.positions) {
		if (statsAll.positions[i].position !== statsAll.lastpos) {
			positions.push(statsAll.positions[i].position);
		}
	}

  return (
    <div className='whitespace' style={{paddingBottom: '0px', marginBottom: 0, flexGrow: 1}}>
			<div style={{display: 'flex', padding: '10px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center'}}>
				<div style={{display: 'flex', flexGrow: 1, maxWidth: '328px', marginBottom: '10px'}}>
					<div className='profilepicture'>
						<img src={steamInfo.avatarfull} alt={statsAll.name} height='150px' />
						<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
							<div className='position' style={{backgroundColor: getPosColor(statsAll.lastpos)}}>{statsAll.lastpos}</div>
							{
								positions.map((item, index) => {
									if (index < 2) {
										return <div className='position' key={item} style={{backgroundColor: getPosColor(item)}}>{item}</div>										
									} else return null
								})
							}
						</div>
					</div>
					<div>
						<div className='playername'>{statsAll.name}</div>
						<div style={{marginTop: '5px', color: 'var(--header-color)', marginBottom: '10px', display: statsAll.name === steamInfo.personaname ? 'none' : 'block'}}>{steamInfo.personaname}</div>
						<div className='teamlogo' style={{marginTop: '5px'}}><img height='16px' src={getTeamLogo(statsAll.team)} alt={statsAll.team}></img> <div style={{color: 'var(--header-color)', marginLeft: '5px'}}>{statsAll.team}</div></div>
						<div className='playersummary' style={{marginTop: '10px', fontSize: '0.75em'}}>{`${statsAll.matches} partido${statsAll.matches === 1 ? '' : 's'}`}</div>
						<div className='playersummary' style={{marginTop: '5px', fontSize: '0.75em'}}>{`${statsAll.wins} victoria${statsAll.wins === 1 ? '' : 's'}`}</div>
						<div className='playersummary' style={{marginTop: '5px', fontSize: '0.75em'}}>{`${statsAll.draws} empate${statsAll.draws === 1 ? '' : 's'}`}</div>
						<div className='playersummary' style={{marginTop: '5px', fontSize: '0.75em'}}>{`${statsAll.losses} derrota${statsAll.losses === 1 ? '' : 's'}`}</div>
					</div>
				</div>
        <div suppressHydrationWarning={true}>
				  {process.browser && <RadarG statsLast15={statsLast15} />}
        </div>
				<div style={{display: 'flex', justifyContent: 'space-evenly', textAlign: 'center', maxWidth: '260px', flexWrap: 'wrap'}}>
					<div className='stat'>
						<div className='value'>{Math.round((statsAll.wins/(statsAll.wins+statsAll.losses))*100)}%</div>
						<div className='label'>Victorias</div>
					</div>
					{
						statsAll.saves > statsAll.shotsontarget ?
						<div className='stat'>
							<div className='value'>{statsAll.savescaught}</div>
							<div className='label'>Atajadas (S/Rebote)</div>
						</div> :
						<div className='stat'>
							<div className='value'>{statsAll.goals}</div>
							<div className='label'>Goles</div>
						</div>
					}
					<div className='stat'>
						<div className='value'>{statsAll.assists}</div>
						<div className='label'>Asistencias</div>
					</div>
					<div className='stat'>
						<div className='value'>{Math.round((statsAll.passescompleted/statsAll.passes)*100)}%</div>
						<div className='label'>Precisión de Pases</div>
					</div>
					{ statsAll.saves > statsAll.shotsontarget ?
					<div className='stat'>
						<div className='value'>{Math.round((statsAll.saves/(statsAll.saves+statsAll.goalsconceded))*100)}%</div>
						<div className='label'>Atajadas</div>
					</div> :
					<div className='stat'>
						<div className='value'>{statsAll.shotsontarget}</div>
						<div className='label'>Tiros al arco</div>
					</div>
					}
					<div className='stat'>
						<div className='value'>{Math.round(statsAll.possession)}%</div>
						<div className='label'>Posesión</div>
					</div>
				</div>
			</div>
		</div>
  );
}