function ImgDisplay({ imgBase64data, selectFunction, selected }: { imgBase64data: string, selectFunction: () => void, selected: boolean }) {
  console.log(selected);

  return (
    <div onClick={ selectFunction } className={ `w-20 h-20 border-5 rounded-md ${selected? "border-red-500" : "border-transparent" }` }>
      <img src={ imgBase64data }></img>
    </div>
  );
}

export default ImgDisplay;