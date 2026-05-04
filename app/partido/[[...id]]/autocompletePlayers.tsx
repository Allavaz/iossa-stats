import { useState } from "react";
import Autosuggest from "react-autosuggest";
import { getTeamLogo } from "../../../utils/Utils";
import { useTeamsMap } from "../../../context/TeamsContext";

export default function AutocompletePlayers(props) {
  const teamsMap = useTeamsMap();
  let players = [];
  for (let i in props.players) {
    players.push({
      steamid: props.players[i]._id,
      name: props.players[i].name,
      team: props.players[i].team,
      teamlogo: getTeamLogo(props.players[i].team, teamsMap)
    });
  }

  const getSuggestions = value => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : players.filter(e => e.name.toLowerCase().includes(inputValue));
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const renderSuggestion = suggestion => (
    <div className="flex cursor-pointer flex-col items-center gap-y-2 border-b border-neutral-300 bg-white p-2 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
      <div className="flex items-center justify-center gap-x-1">
        <img src={suggestion.teamlogo} className="h-6" alt={suggestion.team} />
        <div className="overflow-x-hidden text-ellipsis whitespace-nowrap">
          {suggestion.name}
        </div>
      </div>
      <div className="italic text-neutral-500 dark:text-neutral-400">
        {suggestion.steamid}
      </div>
    </div>
  );

  const renderSuggestionsContainer = ({
    containerProps: { key, ...containerProps },
    children,
    query
  }) => {
    return (
      <div
        key={key}
        {...containerProps}
        className="absolute z-50 w-48 overflow-hidden rounded-lg border-x border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900"
      >
        {children}
      </div>
    );
  };

  const renderInputComponent = ({ key, ...inputProps }) => (
    <input
      key={key}
      {...inputProps}
      className="w-48 rounded border border-neutral-300 px-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
    />
  );

  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue }) => {
    props.onChangePlayer.setPlayerName(newValue.trim());
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    props.onChangePlayer.setPlayerName(suggestion.name);
    props.onChangePlayer.setPlayerSteamId(suggestion.steamid);
    props.changeSteamIdField(suggestion.steamid);
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
    value: props.value,
    onChange: onChange,
    placeholder: "Nombre"
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
      onSuggestionSelected={onSuggestionSelected}
      inputProps={inputProps}
    />
  );
}
