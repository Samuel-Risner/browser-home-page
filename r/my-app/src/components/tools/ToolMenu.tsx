import { useState } from "react";
import ActualMenu from "./ActualMenu";

function ToolMenu({ editingActivated, setEditingActivated }: { editingActivated: boolean, setEditingActivated: (active: boolean) => void }) {
  const [showActualMenu, setShowActualMenu] = useState<boolean>(false);

  if (showActualMenu) return (
    <ActualMenu
      closeFunction={ () => { setShowActualMenu(false) } }
      editingActivated={ editingActivated }
      setEditingActivated={ setEditingActivated }
    ></ActualMenu>
  );

  return (
    <button onClick={ () => { setShowActualMenu(true) } }>T</button>
  );
}

export default ToolMenu;