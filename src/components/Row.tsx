import CONSTANTS from "../constants";
import type DataRow from "../data/row";
import type ImageHandler from "../imgHandler";
import EditRowBtn from "./edit/row/EditRowBtn";
import AddTileBtn from "./edit/tile/AddTileBtn";
import Tile from "./Tile";

function Row(
  { dataRow, editingActivated, updateData, imgHandler }:
  { dataRow: DataRow, editingActivated: boolean, updateData: () => void, imgHandler: ImageHandler }
) {
  return (
    <div className="flex flex-row gap-2">
      { !editingActivated? <></> : <EditRowBtn
        dataRow={ dataRow }
        updateData={ updateData }
      ></EditRowBtn> }

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