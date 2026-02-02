import CONSTANTS from "../constants";
import type DataTile from "../data/tile";

function Tile({ dataTile }: { dataTile: DataTile }) {
  return (
    <div className={ `${CONSTANTS.TWCSS.tileSize} bg-gray-300` }>
      { dataTile.getName() }
    </div>
  );
}

export default Tile;