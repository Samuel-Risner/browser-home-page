import { useState } from "react";
import AddTileMenu from "./AddTileMenu";
import type DataRow from "../../../data/row";
import CONSTANTS from "../../../constants";
import type Data from "../../../data/data";

function AddTileBtn(
  { dataRow, updateData, data }:
  { dataRow: DataRow, updateData: () => void, data: Data }
) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <AddTileMenu
      closeFunction={ () => setShowMenu(false) }
      dataRow={ dataRow }
      updateData={ updateData }
      data={ data }
    ></AddTileMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) } className={ `${CONSTANTS.TWCSS.tileSize}` }>+</button>
  );
}

export default AddTileBtn;