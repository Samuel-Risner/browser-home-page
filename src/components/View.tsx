import type Data from "../data/data";
import type DataTab from "../data/tab";
import AddRowBtn from "./edit/row/AddRowBtn";
import Row from "./Row";

function View(
  { dataTab, editingActivated, updateData, data }:
  { dataTab: DataTab, editingActivated: boolean, updateData: () => void, data: Data }
) {
  return (
    <div className="flex flex-col gap-2 p-2">
      { dataTab.getRows().map((dataRow, index) => <Row
        key={ index }
        dataRow={ dataRow }
        editingActivated={ editingActivated }
        updateData={ updateData }
        data={ data }
      ></Row>)}

      { !editingActivated? <></> : <AddRowBtn
        dataTab={ dataTab }
        updateData={ updateData }
      ></AddRowBtn>}
    </div>
  );
}

export default View;