function ImgDisplay(
  { imgBase64data, selectFunction, selected, deleteFunction }:
  { imgBase64data: string, selectFunction: () => void, selected: boolean, deleteFunction: () => void }
) {

  return (
    <div>
      <div onClick={ selectFunction } className={ `w-20 h-20 border-5 rounded-md ${selected? "border-red-500" : "border-transparent" }` }>
        <img src={ imgBase64data }></img>
      </div>
      <button onClick={ deleteFunction }>XX</button>
    </div>
  );
}

export default ImgDisplay;