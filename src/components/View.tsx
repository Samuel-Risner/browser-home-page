import type DataTab from "../data/tab";
import type ImageHandler from "../imgHandler";
import AddRowBtn from "./edit/row/AddRowBtn";
import Row from "./Row";

function View(
  { dataTab, editingActivated, updateData, imgHandler }:
  { dataTab: DataTab, editingActivated: boolean, updateData: () => void, imgHandler: ImageHandler }
) {
  return (
    <div className="flex flex-col gap-2 p-2">
      { dataTab.getRows().map((dataRow, index) => <Row
        key={ index }
        dataRow={ dataRow }
        editingActivated={ editingActivated }
        updateData={ updateData }
        imgHandler={ imgHandler }
      ></Row>)}

      { !editingActivated? <></> : <AddRowBtn
        dataTab={ dataTab }
        updateData={ updateData }
      ></AddRowBtn>}
    </div>
  );
}

export default View;