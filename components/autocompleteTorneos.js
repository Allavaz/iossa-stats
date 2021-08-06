import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import Torneos from '../utils/Torneos.json';
import { getTournamentIcon } from '../utils/Utils';
import theme from '../styles/autocompleteTorneos.module.css';

export default function AutocompleteTorneos(props) {
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
      e.torneo.toLowerCase().includes(inputValue)
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