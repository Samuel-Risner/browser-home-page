import { useState } from "react";
import ImgMenu from "./ImgMenu";
import type Data from "../../data/data";

function ShowImgMenuBtn(
  { data, selectedImgID, selectImg }:
  { data: Data,  selectedImgID: string, selectImg: (id: string) => void }
) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <ImgMenu
      data={ data }
      closeFunction={ () => setShowMenu(false) }
      selectImg={ selectImg }
      selectedImgID={ selectedImgID }
    ></ImgMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) }>
      { /** @ts-ignore (src can be null) */ }
      { <img src={ data.getBase64(selectedImgID) }></img> }
      <div>select/add image</div>
    </button>
  );
}

export default ShowImgMenuBtn;