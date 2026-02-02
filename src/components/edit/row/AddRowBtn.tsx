import { useState } from "react";
import type DataTab from "../../../data/tab";
import AddRowMenu from "./RowMenu";
import CONSTANTS from "../../../constants";

function AddRowBtn({ dataTab, updateData }: { dataTab: DataTab, updateData: () => void}) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <AddRowMenu
      closeFunction={ () => setShowMenu(false) }
      dataTab={ dataTab }
      updateData={ updateData }
      editing={ false }
      dataRow={ null }
    ></AddRowMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) } className={ `${CONSTANTS.TWCSS.tileSize}` }>+</button>
  );
}

export default AddRowBtn;