import React, { useState } from "react";
import type ImageHandler from "../../imgHandler";
import ImgDisplay from "./ImgDisplay";
import CloseMenuBackdrop from "../misc/CloseMenuBackdrop";
import CONSTANTS from "../../constants";

function fileToBase64 (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function ImgMenu({ imgHandler, closeFunction }: { imgHandler: ImageHandler, closeFunction: () => void }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const selectFunction = (id: string) => {
    if (selectedImg === id) {
      setSelectedImg(null);
    } else {
      setSelectedImg(id);
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const base64 = await fileToBase64(file);
    setSelectedImg(imgHandler.addImg(base64));
  }

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
          <input type="file" accept="image/*" onChange={ handleFileInput }></input>
        </div>

        { imgHandler.getImgDB().map(d => <ImgDisplay
          imgBase64data={ d[1] }
          selectFunction={ () => selectFunction(d[0]) }
          selected={ d[0] === selectedImg }
          key={ d[0] }
        ></ImgDisplay>) }
      </div>
    </>
  );
}

export default ImgMenu;