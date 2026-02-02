import type DataTab from "./data/tab";
import EditTabBtn from "./edit/tab/EditTabBtn";

function Tab(
  { dataTab, active, activate, editingActivated, updateData }:
  { dataTab: DataTab, active: boolean, activate: () => void, editingActivated: boolean, updateData: () => void }
) {
  return (
    <div className="relative">
      { !editingActivated? <></> : <EditTabBtn
        updateData={ updateData }
        dataTab={ dataTab }
      ></EditTabBtn> }

      <button
        onClick={ activate }
        disabled={ active || editingActivated }
        className={ `p-2 ${ active? "" : "bg-gray-500"}` }
      >
        { dataTab.getName() }
      </button>
    </div>
  );
}

export default Tab;