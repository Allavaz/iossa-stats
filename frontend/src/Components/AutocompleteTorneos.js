import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Torneos from '../Torneos.json';
import { getTournamentIcon } from '../Utils';
import theme from './AutocompleteTorneos.module.css';

export default function AutosuggestTorneos(props) {
  let torneos = []
  for (let i in Torneos) {
    for (let j in Torneos[i].torneos) {
      if (Torneos[i].temporada !== 'all') {
        torneos.push({
          torneo: Torneos[i].torneos[j].torneo,
          icono: getTournamentIcon(Torneos[i].torneos[j].torneo)
        })
      }
    }
  }

  const getSuggestions = value => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : torneos.filter(e =>
      e.torneo.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const getSuggestionValue = suggestion => suggestion.torneo;

  const renderSuggestion = suggestion => (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <span>
        <img src={suggestion.icono} 
          height='14pt' 
          style={{marginRight: '.5ch'}}
          alt={suggestion.torneo}
        >
      </img>
      </span>
      <span>{suggestion.torneo}</span>
    </div>
  );

  const [value, setValue] = useState(props.defaultValue);
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, {newValue}) => {
    setValue(newValue);
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
      inputProps={inputProps}
      theme={theme}
    />
  );
}