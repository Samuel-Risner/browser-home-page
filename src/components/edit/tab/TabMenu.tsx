import { useState } from "react";
import CONSTANTS from "../../../constants";
import CloseMenuBackdrop from "../../misc/CloseMenuBackdrop";
import type DataMenu from "../../data/menu";
import type DataTab from "../../data/tab";

function TabMenu(
  { closeFunction, dataMenu, updateData, editing, dataTab }:
  { closeFunction: () => void, dataMenu: DataMenu, updateData: () => void, editing: false, dataTab: null } |
  { closeFunction: () => void, dataMenu: null, updateData: () => void, editing: true, dataTab: DataTab }
) {
  const [name, setName] = useState<string>(editing? dataTab.getName() : "");

  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        <input value={ name } onChange={ (e) => setName(e.target.value) } type="text" className={ CONSTANTS.TWCSS.input }></input>
        <button
          onClick={ () => { editing? dataTab.setName(name) : dataMenu.addTab(name); closeFunction(); updateData(); } }
        >{ editing? "edit" : "create" }</button>
      </div>
    </>
  );
}

export default TabMenu;