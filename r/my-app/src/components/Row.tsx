import CONSTANTS from "../constants";
import type ImageHandler from "../imgHandler";
import type DataRow from "./data/row";
import AddTileBtn from "./edit/tile/AddTileBtn";
import Tile from "./Tile";

function Row(
  { dataRow, editingActivated, updateData, imgHandler }:
  { dataRow: DataRow, editingActivated: boolean, updateData: () => void, imgHandler: ImageHandler }
) {
  return (
    <div className="flex flex-row gap-2">
      <div className={ `${CONSTANTS.TWCSS.tileSize} bg-gray-500` }>
        <div>
          { dataRow.getName() }
        </div>
      </div>

      { dataRow.getTiles().map((dataTile, index) => <Tile
        key={ index }
        dataTile={ dataTile }
      ></Tile> ) }

      { !editingActivated? <></> : <AddTileBtn
        dataRow={ dataRow }
        updateData={ updateData }
        imgHandler={ imgHandler }
      ></AddTileBtn>}
    </div>
  );
}

export default Row;