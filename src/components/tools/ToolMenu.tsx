import { useState } from "react";
import ActualMenu from "./ActualMenu";
import type Data from "../../data/data";

function ToolMenu(
  { editingActivated, setEditingActivated, data }:
  { editingActivated: boolean, setEditingActivated: (active: boolean) => void, data: Data }
) {
  const [showActualMenu, setShowActualMenu] = useState<boolean>(false);

  if (showActualMenu) return (
    <ActualMenu
      closeFunction={ () => { setShowActualMenu(false) } }
      editingActivated={ editingActivated }
      setEditingActivated={ setEditingActivated }
      data={ data }
    ></ActualMenu>
  );

  return (
    <button onClick={ () => { setShowActualMenu(true) } }>T</button>
  );
}

export default ToolMenu;