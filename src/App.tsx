import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Data from "./data/data";
import loadURLsearchParams from "./helpers/loadURLsearchParams";
import type { T_COLOR_SCHEME, T_DATA, T_ENCRYPTED_DATA, T_URL_SEARCH_PARAMS } from "./types";
import ErrorContainer from "./components/error/ErrorContainer";
import CONSTANTS from "./constants";
import InputPassword from "./components/misc/InputPassword";
import { decrypt } from "./helpers/encryption";

function App() {
  // // //
  // // // - states
  // // //

  const [URLsearchParams, _] = useState<T_URL_SEARCH_PARAMS>(loadURLsearchParams()[0]);
  const [errors, setErrors] = useState<string[]>(loadURLsearchParams()[1]);

  // change <App> component to update view
  const [updateValue, updateFunction] = useState<boolean>(true);

  const [data, setData] = useState<Data | null>(URLsearchParams.from === "local"? new Data(CONSTANTS.DEFAULT_VALUES.DATA, URLsearchParams) : null);

  // only used when <from> in <URLsearchParams> is <site>
  // (or in other words: unsaved changes are only indicated when the data comes from the site)
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  // 0 > waiting for password | 1 > password set (needs to be processed now) | 2 > data already loaded
  // (password is not stored for a long time using this approach)
  const [password, setPassword] = useState<[0, null] | [1, string] | [2, null]>([0, null]);

  const [colorScheme, setColorScheme] = useState<T_COLOR_SCHEME>(CONSTANTS.COLOR_SCHEME.DEFAULT);

  // // //
  // // // - styling
  // // //

  document.body.className = colorScheme.bg;

  // // //
  // // // - fetch data from site (if needed)
  // // //

  useEffect(() => {
    if (URLsearchParams.from !== "site") return;

    // if password is needed only continue if it is set
    if (URLsearchParams.encrypted) {
      if (password[0] === 0 || password[0] === 2) {
        return;
      } else {
        setPassword([2, null]); // clear password for security
      }
    }

    const fetchData = async () => {
      const response = await fetch(`/${URLsearchParams.src}`);

      // fetch file
      if (!response.ok) {
        setErrors(["HTTP error while fetching JSON file", ...errors]);
        setData(new Data(CONSTANTS.DEFAULT_VALUES.DATA, URLsearchParams));
        return;
      }

      let data: T_DATA | T_ENCRYPTED_DATA = CONSTANTS.DEFAULT_VALUES.DATA;

      // parse JSON
      try {
        data = await response.json();
      } catch (error) {
        setErrors(["Could not process JSON file", ...errors]);
        setData(new Data(CONSTANTS.DEFAULT_VALUES.DATA, URLsearchParams));
        return;
      }

      let encryptedData: string = "";

      // decrypt (if necessary)
      if (password[0] === 1) {
        try {
          encryptedData = await decrypt(password[1], data as T_ENCRYPTED_DATA);
        } catch (error) {
          setErrors(["Could not decrypt data", ...errors]);
          setPassword([0, null]); // password needs to be reentered
          return;
        }
      }

      // parse decrypted data (if necessary)
      if (password[0] === 1) {
        try {
          data = JSON.parse(encryptedData);
        } catch (error) {
          setErrors(["Could not process decrypted JSON file", ...errors]);
          setPassword([0, null]); // password needs to be reentered
          return;
        }
      }

      // use parsed data
      try {
        setData(new Data(data as T_DATA, URLsearchParams));
      } catch (error) {
        setErrors(["JSON contents are not formatted correctly", ...errors]);
        setData(new Data(CONSTANTS.DEFAULT_VALUES.DATA, URLsearchParams));
      }
    };

    fetchData();
  }, [password[0]]);

  // // //
  // // // - password input
  // // //
  
  if (URLsearchParams.encrypted && password[0] === 0) return (
    <>
      <ErrorContainer errorsToHandle={ errors }></ErrorContainer>

      <InputPassword
        submit={ (pswd: string) => setPassword([1, pswd]) }
      ></InputPassword>
    </>
  )
  
  // // //
  // // // - wait for data to get fetched
  // // //

  if (data === null) return <>Loading...</>;
  
  // // //
  // // // - when data changes
  // // //

  const updateDataFunction = () => {
    data.save(); // save to ls (if required)
    updateFunction(!updateValue); // update view

    // indicate unsaved changes (if required)
    if (URLsearchParams.from !== "site") return;
    setUnsavedChanges(true);
  }

  // // //
  // // // - app
  // // //

  return (
    <>
      <ErrorContainer errorsToHandle={ errors }></ErrorContainer>

      { data.getMenus().map((dataMenu, index) => <Menu
        data={ data }
        dataMenu={ dataMenu }
        showToolMenuButton={ index === 0 /** only the first menu has the tool menu button */ }
        indicateUnsavedChanges={ index === 0 && unsavedChanges /** only the first menu indicates unsaved changes */ }
        updateDataFunction={ updateDataFunction }
        key={ index }
      ></Menu>) }
    </>
  );
}

export default App;