import CONSTANTS from "../../constants";
import CloseMenuBackdrop from "../misc/CloseMenuBackdrop";

function ActualMenu({ closeFunction, editingActivated, setEditingActivated }: { closeFunction: () => void, editingActivated: boolean, setEditingActivated: (active: boolean) => void }) {
  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <button onClick={ closeFunction }>x</button>
        <button>Download data</button>
        { editingActivated? <button onClick={ () => setEditingActivated(false) }>Deactivate editing</button> : <button onClick={ () => setEditingActivated(true) }>Activate editing</button>}
      </div>
    </>
  );
}

export default ActualMenu;