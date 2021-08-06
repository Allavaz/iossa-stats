import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Teams from '../utils/Teams.json';
import { getTeamLogo } from '../utils/Utils';
import theme from '../styles/autocompleteTeams.module.css';

export default function AutocompleteTeams(props) {
  let teams = []
  for (let i in Teams) {
    teams.push({
      team: i,
      logo: getTeamLogo(i)
    })
  }

  const getSuggestions = value => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : teams.filter(e =>
      e.team.toLowerCase().includes(inputValue)
    );
  };

  const getSuggestionValue = suggestion => suggestion.team;

  const renderSuggestion = suggestion => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <span>
        <img src={suggestion.logo} 
          height='16pt' 
          style={{marginRight: '.5ch'}}
          alt={suggestion.team}
        >
      </img>
      </span>
      <span>{suggestion.team}</span>
    </div>
  );

  const [value, setValue] = useState(props.defaultValue);
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, {newValue, method}) => {
    setValue(newValue);
    props.setValue(newValue.trim());
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
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme}
    />
  );
}