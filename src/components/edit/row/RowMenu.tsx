import { useState } from "react";
import CONSTANTS from "../../../constants";
import CloseMenuBackdrop from "../../misc/CloseMenuBackdrop";
import type DataTab from "../../../data/tab";
import type DataRow from "../../../data/row";

function RowMenu({ closeFunction, dataTab, updateData, editing, dataRow }:
  { closeFunction: () => void, dataTab: DataTab, updateData: () => void, editing: false, dataRow: null } |
  { closeFunction: () => void, dataTab: null, updateData: () => void, editing: true, dataRow: DataRow }
) {
  const [name, setName] = useState<string>(editing? dataRow.getName() : "");

  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        <input value={ name } onChange={ (e) => setName(e.target.value) } type="text" className={ CONSTANTS.TWCSS.input }></input>
        <button
          onClick={ () => { editing? dataRow.setName(name) : dataTab.addRow(name); closeFunction(); updateData(); } }
        >{ editing? "edit" : "create" }</button>
      </div>
    </>
  );
}

export default RowMenu;