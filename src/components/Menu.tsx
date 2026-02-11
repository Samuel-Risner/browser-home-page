import { useState } from "react";
import type Data from "../data/data";
import type DataMenu from "../data/menu";
import Tab from "./Tab";
import View from "./View";
import ToolMenu from "./tools/ToolMenu";
import AddTabBtn from "./edit/tab/AddTabBtn";

function Menu(
  { data, dataMenu, showToolMenuButton, indicateUnsavedChanges, updateDataFunction }:
  { data: Data, dataMenu: DataMenu, showToolMenuButton: boolean, indicateUnsavedChanges: boolean, updateDataFunction: () => void }
) {
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(dataMenu.getTabs().length > 0? 0 : null);
  const [editingActivated, setEditingActivated] = useState<boolean>(false);

  return (
    <>
      <div className="bg-gray-300 flex flex-row p-2 gap-2">
        <div className="flex grow gap-2">
          { dataMenu.getTabs().map((dataTab, index) => <Tab
            key={ index }
            dataTab={ dataTab }
            active={ index === activeTabIndex }
            activate={ () => {setActiveTabIndex(index) } }
            editingActivated={ editingActivated }
            updateData={ updateDataFunction }
          ></Tab>)}

          { !editingActivated? <></> : <AddTabBtn
            dataMenu={ dataMenu }
            updateData={ updateDataFunction }
          ></AddTabBtn>}
        </div>

        { !indicateUnsavedChanges? <></> : <div title="unsaved changes" className="w-4 h-4 m-auto bg-red-500 rounded-full"></div> }

        { !showToolMenuButton? <></> : <ToolMenu
          editingActivated={ editingActivated }
          setEditingActivated={ setEditingActivated }
          data={ data }
        ></ToolMenu> }
      </div>

      { activeTabIndex === null ? <></> : <View
        dataTab={ dataMenu.getTabs()[activeTabIndex] }
        editingActivated={ editingActivated }
        updateData={ updateDataFunction }
        data={ data }
      ></View> }
    </>
  );
}

export default Menu;