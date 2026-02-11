import { useState } from "react";
import CONSTANTS from "../../constants";
import type Data from "../../data/data";
import downloadFile from "../../helpers/downloadFile";
import CloseMenuBackdrop from "../misc/CloseMenuBackdrop";
import { encrypt } from "../../helpers/encryption";

function ActualMenu(
  { closeFunction, editingActivated, setEditingActivated, data }:
  { closeFunction: () => void, editingActivated: boolean, setEditingActivated: (active: boolean) => void, data: Data }
) {
  const [password, setPassword] = useState<string | null>(null);

  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        <button onClick={ () => downloadFile("data.json", data.getJSON()) }>Download data</button>

        { password === null?
          <button onClick={ () => setPassword("") }>Download data (encrypted)</button> :
          <div className="border-2 border-black">
            <input value={ password } onChange={ (e) => setPassword(e.target.value) }></input>
            <button onClick={ async () => downloadFile("data.json.encrypted", await encrypt(password, data.getJSON()))}>Download</button>
          </div>
        }

        { editingActivated? <button onClick={ () => setEditingActivated(false) }>Deactivate editing</button> : <button onClick={ () => setEditingActivated(true) }>Activate editing</button>}
      </div>
    </>
  );
}

export default ActualMenu;