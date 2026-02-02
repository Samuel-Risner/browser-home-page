import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import ImageHandler from "./imgHandler";
import loadURLparams from "./loadURLsearchParams";
import Data from "./data/data";

/**
 * Modes:
 * ?from=site ?src=1 ?useLS=true ?encrypted=true ?savePswd=true
 * 
 * ?from=local ?useLS=true
 */

function App() {
  const [updateValue, updateFunction] = useState<boolean>(true);
  const [data, setData] = useState<Data | null>(null);
  const [imgHandler, setImgHandler] = useState<ImageHandler | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  loadURLparams();
  
  const updateData = () => {
    updateFunction(!updateValue);
    setUnsavedChanges(true);
  }

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(new Data(data)));
  }, []);

  useEffect(() => {
    fetch("/imgs.json")
      .then((res) => res.json())
      .then((data) => setImgHandler(new ImageHandler(data)));
  }, []);

  if (data === null || imgHandler === null) return <>Loading...</>;

  return (
    <>
      { data.getMenus().map((dataMenu, index) => <Menu
        key={ index }
        dataMenu={ dataMenu }
        showToolMenu={ index === 0 }
        unsavedChanges={ unsavedChanges }
        updateData={ updateData }
        imgHandler={ imgHandler }
      ></Menu>) }
    </>
  );
}

export default App;