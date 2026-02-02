import { useState } from "react";
import RowMenu from "./RowMenu";
import type DataRow from "../../../data/row";

function  EditRowBtn({ updateData, dataRow }: { updateData: () => void, dataRow: DataRow }) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <RowMenu
      closeFunction={ () => setShowMenu(false) }
      dataTab={ null }
      updateData={ updateData }
      editing={ true }
      dataRow={ dataRow }
    ></RowMenu>
  );

  return (
    <button
      onClick={ () => setShowMenu(true) }
      className="bg-red-500 w-6 h-6 rounded-full absolute -top-2 -right-2"
    >E</button>
  );
}

export default EditRowBtn;