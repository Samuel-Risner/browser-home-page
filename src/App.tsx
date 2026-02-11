import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import Data from "./data/data";
import loadURLsearchParams from "./helpers/loadURLsearchParams";
import type { T_DATA, T_ENCRYPTED_DATA, T_URL_SEARCH_PARAMS } from "./types";
import ErrorContainer from "./components/error/ErrorContainer";
import CONSTANTS from "./constants";
import InputPassword from "./components/misc/InputPassword";
import { decrypt } from "./helpers/encryption";

function App() {
  const [URLsearchParams, _] = useState<T_URL_SEARCH_PARAMS>(loadURLsearchParams()[0]);
  const [errors, setErrors] = useState<string[]>(loadURLsearchParams()[1]);
  const [updateValue, updateFunction] = useState<boolean>(true);
  const [data, setData] = useState<Data | null>(URLsearchParams.from === "local"? new Data(CONSTANTS.DEFAULT_VALUES.DATA, URLsearchParams) : null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [password, setPassword] = useState<[0, null] | [1, string] | [2, null]>([0, null]);
  // 0 > waiting for password | 1 > password set (needs to be processed now) | 2 > data already loaded

  useEffect(() => {
    if (URLsearchParams.from !== "site") return;

    if (URLsearchParams.encrypted) {
      if (password[0] === 0 || password[0] === 2) {
        return;
      } else {
        setPassword([2, null]);
      }
    }

    const fetchData = async () => {
      const response = await fetch(`/${URLsearchParams.src}`);

      // Fetch file
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
          setPassword([0, null]);
          return;
        }
      }

      // parse decrypted data (if necessary)
      if (password[0] === 1) {
        try {
          data = JSON.parse(encryptedData);
        } catch (error) {
          setErrors(["Could not process decrypted JSON file", ...errors]);
          setPassword([0, null]);
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

  if (URLsearchParams.encrypted && password[0] === 0) return (
    <>
      <ErrorContainer errorsToHandle={ errors }></ErrorContainer>

      <InputPassword
        submit={ (pswd: string) => setPassword([1, pswd]) }
      ></InputPassword>
    </>
  )
  
  if (data === null) return <>Loading...</>;
  
  const updateData = () => {
    data.save();
    updateFunction(!updateValue);

    if (URLsearchParams.from !== "site") return;
    
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