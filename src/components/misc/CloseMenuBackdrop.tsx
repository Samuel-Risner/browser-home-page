function CloseMenuBackdrop({ closeFunction }: { closeFunction: () => void }) {
  return (
    <div onClick={ closeFunction } className="fixed top-0 left-0 w-screen h-screen"></div>
  );
}

export default CloseMenuBackdrop;