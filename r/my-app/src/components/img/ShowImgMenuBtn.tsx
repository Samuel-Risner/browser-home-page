import { useState } from "react";
import ImgMenu from "./ImgMenu";
import type ImageHandler from "../../imgHandler";

function ShowImgMenuBtn({ imgHandler }: { imgHandler: ImageHandler }) {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (showMenu) return (
    <ImgMenu
      imgHandler={ imgHandler }
      closeFunction={ () => setShowMenu(false) }
    ></ImgMenu>
  );

  return (
    <button onClick={ () => setShowMenu(true) }>select/add image</button>
  );
}

export default ShowImgMenuBtn;