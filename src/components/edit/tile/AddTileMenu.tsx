import { useState } from "react";
import CONSTANTS from "../../../constants";
import CloseMenuBackdrop from "../../misc/CloseMenuBackdrop";
import type DataRow from "../../../data/row";
import ToggleBtn from "../../misc/ToggleBtn";
import ShowImgMenuBtn from "../../img/ShowImgMenuBtn";
import type Data from "../../../data/data";

function AddTileMenu(
  { closeFunction, dataRow, updateData, data }:
  { closeFunction: () => void, dataRow: DataRow, updateData: () => void, data: Data }
) {
  const [newTileName, setNewTileName] = useState<string>("");
  const [newTileType, setNewTileType] = useState<boolean>(true);
  const [newTileLinkORtextToCopy, setNewTileLinkORtextToCopy] = useState<string>("");
  const [newTileImgID, setNewTileImgID] = useState<string>("");

  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        
        <input value={ newTileName } onChange={ (e) => setNewTileName(e.target.value) } type="text" className={ CONSTANTS.TWCSS.input }></input>

        <ToggleBtn
          updateState={ setNewTileType }
          state={ newTileType }
          option1text="link"
          option2text="copy"
        ></ToggleBtn>

        <input value={ newTileLinkORtextToCopy } onChange={ (e) => setNewTileLinkORtextToCopy(e.target.value) } type="text" className={ CONSTANTS.TWCSS.input }></input>

        <ShowImgMenuBtn
          data={ data }
          selectImg={ setNewTileImgID }
          selectedImgID={ newTileImgID }
        ></ShowImgMenuBtn>

        <button onClick={ () => { dataRow.addTile(newTileName, newTileType? "link" : "copy", newTileLinkORtextToCopy, null); closeFunction(); updateData(); } }>create</button>
      </div>
    </>
  );
}

export default AddTileMenu;