import CONSTANTS from "../constants";
import type Data from "../data/data";
import type DataRow from "../data/row";
import EditRowBtn from "./edit/row/EditRowBtn";
import AddTileBtn from "./edit/tile/AddTileBtn";
import Tile from "./Tile";

function Row(
  { dataRow, editingActivated, updateData, data }:
  { dataRow: DataRow, editingActivated: boolean, updateData: () => void, data: Data }
) {
  return (
    <div className="flex flex-row gap-2">
      <div className={ `${CONSTANTS.TWCSS.tileSize} bg-gray-500 relative` }>
        <div>
          { dataRow.getName() }
        </div>

        { !editingActivated? <></> : <EditRowBtn
          dataRow={ dataRow }
          updateData={ updateData }
        ></EditRowBtn> }
      </div>

      { dataRow.getTiles().map((dataTile, index) => <Tile
        key={ index }
        dataTile={ dataTile }
      ></Tile> ) }

      { !editingActivated? <></> : <AddTileBtn
        dataRow={ dataRow }
        updateData={ updateData }
        data={ data }
      ></AddTileBtn>}
    </div>
  );
}

export default Row;