import { useState } from "react";
import CONSTANTS from "../../../constants";
import CloseMenuBackdrop from "../../misc/CloseMenuBackdrop";
import type DataTab from "../../data/tab";

function AddRowMenu({ closeFunction, dataTab, updateData }: { closeFunction: () => void, dataTab: DataTab, updateData: () => void }) {
  const [newRowName, setNewRowName] = useState<string>("");

  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        <input value={ newRowName } onChange={ (e) => setNewRowName(e.target.value) } type="text" className={ CONSTANTS.TWCSS.input }></input>
        <button onClick={ () => { dataTab.addRow(newRowName); closeFunction(); updateData(); } }>create</button>
      </div>
    </>
  );
}

export default AddRowMenu;