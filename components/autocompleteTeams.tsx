import { useState } from "react";
import Autosuggest from "react-autosuggest";
import Teams from "../utils/Teams.json";
import { getTeamLogo } from "../utils/Utils";

export default function AutocompleteTeams(props) {
  const [value, setValue] = useState(props.defaultValue);
  const [suggestions, setSuggestions] = useState([]);

  let teams = [];
  for (let i in Teams) {
    teams.push({
      team: i,
      logo: getTeamLogo(i)
    });
  }

  const getSuggestions = value => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : teams.filter(e => e.team.toLowerCase().includes(inputValue));
  };

  const getSuggestionValue = suggestion => suggestion.team;

  const renderSuggestion = suggestion => (
    <div className="flex cursor-pointer items-center justify-center gap-x-1 border-b border-neutral-300 bg-white p-2 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
      <img src={suggestion.logo} className="h-6" alt={suggestion.team} />
      <div className="overflow-x-hidden text-ellipsis whitespace-nowrap">
        {suggestion.team}
      </div>
    </div>
  );

  const renderSuggestionsContainer = ({ containerProps, children, query }) => {
    return (
      <div
        {...containerProps}
        className="absolute z-50 w-64 overflow-hidden rounded-lg border-x border-neutral-300 dark:border-neutral-700"
      >
        {children}
      </div>
    );
  };

  const renderInputComponent = inputProps => (
    <input
      {...inputProps}
      className="w-64 rounded border border-neutral-300 p-1 text-center shadow-lg dark:border-neutral-700"
    />
  );

  const onChange = (event, { newValue, method }) => {
    setValue(newValue);
    props.setValue(newValue.trim());
  };

  const onSuggestionsFetchRequested = ({ value, reason }) => {
    if (reason === "input-changed") {
      setSuggestions(getSuggestions(value).slice(0, 15));
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    value,
    onChange: onChange
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      renderSuggestionsContainer={renderSuggestionsContainer}
      renderInputComponent={renderInputComponent}
      inputProps={inputProps}
    />
  );
}
