import React from "react";
import ImgDisplay from "./ImgDisplay";
import CloseMenuBackdrop from "../misc/CloseMenuBackdrop";
import CONSTANTS from "../../constants";
import type Data from "../../data/data";

function fileToBase64 (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function ImgMenu(
  { data, closeFunction, selectedImgID, selectImg }:
  { data: Data, closeFunction: () => void, selectedImgID: string, selectImg: (id: string) => void }
) {
  const selectFunction = (id: string) => {
    if (selectedImgID === id) {
      selectImg("");
    } else {
      selectImg(id);
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const base64 = await fileToBase64(file);
    selectImg(data.addImg(base64));
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

        { data.getImgDB().map(d => <ImgDisplay
          imgBase64data={ d[1] }
          selectFunction={ () => selectFunction(d[0]) }
          selected={ d[0] === selectedImgID }
          deleteFunction={ () => {
            data.deleteImg(d[0]);
            if (d[0] === selectedImgID) selectFunction(d[0]);
          }}
          key={ d[0] }
        ></ImgDisplay>) }
      </div>
    </>
  );
}

export default ImgMenu;