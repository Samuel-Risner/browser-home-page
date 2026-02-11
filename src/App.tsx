import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Data from "./data/data";
import loadURLsearchParams from "./loadURLsearchParams";
import type { T_DATA, T_URL_SEARCH_PARAMS } from "./types";

/**
 * Modes:
 * ?from=site ?src=1 ?useLS=true ?encrypted=true ?savePswd=true
 * 
 * ?from=local ?useLS=true
 */

function App() {
  const urlSearchParams: T_URL_SEARCH_PARAMS = loadURLsearchParams()[0];

  const [updateValue, updateFunction] = useState<boolean>(true);
  const [data, setData] = useState<Data | null>(urlSearchParams.from === "local"? new Data([[["default menu", [["default tab", []]]]], [0, []]], urlSearchParams) : null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const updateData = () => {
    updateFunction(!updateValue);
    setUnsavedChanges(true);
  }

  if (urlSearchParams.from === "site") {
    useEffect(() => {
      fetch("/data.json")
        .then((res) => res.json())
        .then((data: T_DATA) => setData(new Data(data, urlSearchParams)));
    }, []);
  }

  if (data === null) return <>Loading...</>;

  return (
    <>
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