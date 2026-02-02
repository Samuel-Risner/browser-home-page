import { useState } from "react";
import TabMenu from "./TabMenu";
import type DataTab from "../../../data/tab";

function EditTabBtn({ updateData, dataTab }: { updateData: () => void, dataTab: DataTab }) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <TabMenu
      closeFunction={ () => setShowMenu(false) }
      dataMenu={ null }
      updateData={ updateData }
      editing={ true }
      dataTab={ dataTab }
    ></TabMenu>
  );

  return (
    <button
      onClick={ () => setShowMenu(true) }
      className="bg-red-500 w-6 h-6 rounded-full absolute -top-2 -right-2"
    >E</button>
  );
}

export default EditTabBtn;