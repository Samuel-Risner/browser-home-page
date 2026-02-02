import { useState } from "react";
import type ImageHandler from "../../imgHandler";
import ImgDisplay from "./ImgDisplay";
import CloseMenuBackdrop from "../misc/CloseMenuBackdrop";
import CONSTANTS from "../../constants";

function ImgMenu({ imgHandler, closeFunction }: { imgHandler: ImageHandler, closeFunction: () => void }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <>
      <CloseMenuBackdrop
        closeFunction={ closeFunction }
      ></CloseMenuBackdrop>

      <div className={ CONSTANTS.TWCSS.menuBase }>
        <div>
          <div>Image handler</div>
          <button onClick={ closeFunction }>x</button>
        </div>
        <div>
          <input type="file" accept="image/*"></input>
        </div>
        { imgHandler.getImgDB().map(d => <ImgDisplay
          imgBase64data={ d[1] }
          selectFunction={ () => setSelectedImg(d[0]) }
          selected={ d[0] === selectedImg }
        ></ImgDisplay>) }
      </div>
    </>
  );
}

export default ImgMenu;