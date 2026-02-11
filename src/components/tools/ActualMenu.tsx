import CONSTANTS from "../../constants";
import type Data from "../../data/data";
import downloadFile from "../../helpers/downloadFile";
import CloseMenuBackdrop from "../misc/CloseMenuBackdrop";

function ActualMenu(
  { closeFunction, editingActivated, setEditingActivated, data }:
  { closeFunction: () => void, editingActivated: boolean, setEditingActivated: (active: boolean) => void, data: Data }
) {
  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        <button onClick={ () => downloadFile("data.json", data.getJSON()) }>Download data</button>
        <button>Download data (encrypted)</button>
        { editingActivated? <button onClick={ () => setEditingActivated(false) }>Deactivate editing</button> : <button onClick={ () => setEditingActivated(true) }>Activate editing</button>}
      </div>
    </>
  );
}

export default ActualMenu;