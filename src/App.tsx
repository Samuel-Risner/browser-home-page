import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Data from "./data/data";
import loadURLsearchParams from "./helpers/loadURLsearchParams";
import type { T_DATA, T_URL_SEARCH_PARAMS } from "./types";
import ErrorContainer from "./components/error/ErrorContainer";
import CONSTANTS from "./constants";

function App() {
  const [[urlSearchParams, errors], setURLSearchParams] = useState<[T_URL_SEARCH_PARAMS, string[]]>(loadURLsearchParams());
  const [updateValue, updateFunction] = useState<boolean>(true);
  const [data, setData] = useState<Data | null>(urlSearchParams.from === "local"? new Data(CONSTANTS.DEFAULT_VALUES.DATA, urlSearchParams) : null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  useEffect(() => {
    if (urlSearchParams.from !== "site") return;

    const fetchData = async () => {
      const response = await fetch(`/${urlSearchParams.src}`);

      if (!response.ok) {
        setURLSearchParams([urlSearchParams, ["HTTP error while fetching JSON file", ...errors]]);
        setData(new Data(CONSTANTS.DEFAULT_VALUES.DATA, urlSearchParams));
        return;
      }

      let data: T_DATA = CONSTANTS.DEFAULT_VALUES.DATA;

      try {
        data = await response.json();
      } catch (error) {
        setURLSearchParams([urlSearchParams, ["Could not process JSON file", ...errors]]);
        setData(new Data(CONSTANTS.DEFAULT_VALUES.DATA, urlSearchParams));
        return;
      }

      try {
        setData(new Data(data, urlSearchParams));
      } catch (error) {
        setURLSearchParams([urlSearchParams, ["JSON contents are not formatted correctly", ...errors]]);
        setData(new Data(CONSTANTS.DEFAULT_VALUES.DATA, urlSearchParams));
      }
    };

    fetchData();
  }, []);
  
  if (data === null) return <>Loading...</>;

  data.save();
  
  const updateData = () => {
    data.save();
    updateFunction(!updateValue);

    if (urlSearchParams.from !== "site") return;
    
    setUnsavedChanges(true);
  }

  return (
    <>
      <ErrorContainer errorsToHandle={ errors }></ErrorContainer>
      { data.getMenus().map((dataMenu, index) => <Menu
        key={ index }
        dataMenu={ dataMenu }
        showToolMenu={ index === 0 }
        unsavedChanges={ unsavedChanges }
        updateData={ updateData }
        data={ data }
      ></Menu>) }
    </>
  );
}

export default App;