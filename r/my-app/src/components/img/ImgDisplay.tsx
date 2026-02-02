function ImgDisplay({ imgBase64data, selectFunction, selected }: { imgBase64data: string, selectFunction: () => void, selected: boolean }) {
  return (
    <div onClick={ selectFunction } className={ `w-20 h-20` }>
      <img src={ imgBase64data }></img>
    </div>
  );
}

export default ImgDisplay;