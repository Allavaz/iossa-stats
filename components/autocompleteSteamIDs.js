import { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { getTeamLogo } from '../utils/Utils';
import theme from '../styles/autocompletePlayers.module.css';

export default function AutocompleteSteamIDs(props) {
  let players = []
  for (let i in props.players) {
    players.push({
      steamid: props.players[i]._id,
      name: props.players[i].name,
      team: props.players[i].team,
      teamlogo: getTeamLogo(props.players[i].team)
    })
  }

  useEffect(() => {
    setValue(props.value)
  }, [props.value]);

  const getSuggestions = value => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : players.filter(e =>
      e.steamid.toLowerCase().includes(inputValue)
    );
  };

  const getSuggestionValue = suggestion => suggestion.steamid;

  const renderSuggestion = suggestion => (
    <div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px'}}>
        <div>
          <img src={suggestion.teamlogo} 
            height='16pt' 
            style={{marginRight: '.5ch'}}
            alt={suggestion.team}
          >
        </img>
        </div>
        <div style={{textAlign: 'center'}}>{suggestion.name}</div>
      </div>
      <div style={{color: 'var(--header-color)', fontSize: '9pt', padding: '5px', paddingTop: '2px'}}><i>{suggestion.steamid}</i></div>
    </div>
  );

  const [value, setValue] = useState(props.defaultValue);
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, {newValue}) => {
    setValue(newValue);
    props.onChangePlayer.setPlayerSteamId(newValue.trim());
  }

  const onSuggestionSelected = (event, {suggestion}) => {
    setValue(suggestion.steamid);
    props.onChangePlayer.setPlayerName(suggestion.name);
    props.onChangePlayer.setPlayerSteamId(suggestion.steamid);
    props.changePlayerField(suggestion.name);
  }

  const onSuggestionsFetchRequested = ({value, reason}) => {
    if (reason === 'input-changed') {
      setSuggestions(getSuggestions(value).slice(0,15));
    }
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  }

  const inputProps = {
    value,
    onChange: onChange,
    placeholder: 'SteamID'
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={onSuggestionSelected}
      inputProps={inputProps}
      theme={theme}
    />
  );
}