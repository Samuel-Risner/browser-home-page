import { useState } from "react";
import type DataMenu from "../data/menu";
import Tab from "./Tab";
import View from "./View";
import ToolMenu from "./tools/ToolMenu";
import AddTabBtn from "./edit/tab/AddTabBtn";
import type ImageHandler from "../imgHandler";

function Menu(
  { dataMenu, showToolMenu, unsavedChanges, updateData, imgHandler }:
  { dataMenu: DataMenu, showToolMenu: boolean, unsavedChanges: boolean, updateData: () => void, imgHandler: ImageHandler }
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
            updateData={ updateData }
          ></Tab>)}

          { !editingActivated? <></> : <AddTabBtn
            dataMenu={ dataMenu }
            updateData={ updateData }
          ></AddTabBtn>}
        </div>

        { !unsavedChanges? <></> : <div title="unsaved changes" className="w-4 h-4 m-auto bg-red-500 rounded-full"></div> }

        { !showToolMenu? <></> : <ToolMenu
          editingActivated={ editingActivated }
          setEditingActivated={ setEditingActivated }
        ></ToolMenu> }
      </div>

      { activeTabIndex === null ? <></> : <View
        dataTab={ dataMenu.getTabs()[activeTabIndex] }
        editingActivated={ editingActivated }
        updateData={ updateData }
        imgHandler={ imgHandler }
      ></View> }
    </>
  );
}

export default Menu;