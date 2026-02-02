import { useState } from "react";
import AddTileMenu from "./AddTileMenu";
import type DataRow from "../../../data/row";
import CONSTANTS from "../../../constants";
import type ImageHandler from "../../../imgHandler";

function AddTileBtn(
  { dataRow, updateData, imgHandler }:
  { dataRow: DataRow, updateData: () => void, imgHandler: ImageHandler }
) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <AddTileMenu
      closeFunction={ () => setShowMenu(false) }
      dataRow={ dataRow }
      updateData={ updateData }
      imgHandler={ imgHandler }
    ></AddTileMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) } className={ `${CONSTANTS.TWCSS.tileSize}` }>+</button>
  );
}

export default AddTileBtn;