import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { getTeamLogo } from '../Utils';
import theme from './AutocompletePlayers.module.css';

export default function AutocompletePlayers(props) {
  let players = []
  for (let i in props.players) {
    players.push({
      steamid: props.players[i]._id,
      name: props.players[i].name,
      team: props.players[i].team,
      teamlogo: getTeamLogo(props.players[i].team)
    })
  }

  const getSuggestions = value => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : players.filter(e =>
      e.name.toLowerCase().slice(0, inputLength) === inputValue ||
      e.steamid.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const renderSuggestion = suggestion => (
    <div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px'}}>
        <span>
          <img src={suggestion.teamlogo} 
            height='16pt' 
            style={{marginRight: '.5ch'}}
            alt={suggestion.team}
          >
        </img>
        </span>
        <span>{suggestion.name}</span>
      </div>
      <div style={{color: 'var(--header-color)', fontSize: '9pt', padding: '5px', paddingTop: '2px'}}><i>{suggestion.steamid}</i></div>
    </div>
  );

  const [value, setValue] = useState(props.defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [id, setId] = useState(props.defaultId);

  const onChange = (event, {newValue}) => {
    setValue(newValue);
  }

  const onSuggestionSelected = (event, {suggestion}) => {
    setValue(suggestion.name);
    setId(suggestion.steamid);
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
    onChange: onChange
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