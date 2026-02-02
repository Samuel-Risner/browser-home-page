import { useState } from "react";
import TabMenu from "./TabMenu";
import type DataMenu from "../../data/menu";

function AddTabBtn({ dataMenu, updateData }: { dataMenu: DataMenu, updateData: () => void }) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <TabMenu
      closeFunction={ () => setShowMenu(false) }
      dataMenu={ dataMenu }
      updateData={ updateData }
      editing={ false }
      dataTab={ null }
    ></TabMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) }>+</button>
  );
}

export default AddTabBtn;