import { useState } from "react";
import ImgMenu from "./ImgMenu";
import type ImageHandler from "../../imgHandler";

function ShowImgMenuBtn(
  { imgHandler, selectedImgID, selectImg }:
  { imgHandler: ImageHandler,  selectedImgID: string, selectImg: (id: string) => void }
) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <ImgMenu
      imgHandler={ imgHandler }
      closeFunction={ () => setShowMenu(false) }
      selectImg={ selectImg }
      selectedImgID={ selectedImgID }
    ></ImgMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) }>
      { <img src={ imgHandler.getBase64(selectedImgID) }></img> }
      <div>select/add image</div>
    </button>
  );
}

export default ShowImgMenuBtn;