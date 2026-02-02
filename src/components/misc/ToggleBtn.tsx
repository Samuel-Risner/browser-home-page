import tw from "../../tw";

function getStyle(state: boolean) {
  return tw(`w-4 h-4 rounded-full m-1 ${ state? "bg-gray-100" : "" }`);
}

function ToggleBtn({ updateState, state, option1text, option2text }: { updateState: (btnState: boolean) => void, state: boolean, option1text: string, option2text: string }) {
  return (
    <div className="flex flex-row m-auto">
      { option1text }
      <button onClick={ () => updateState(!state) } className="bg-gray-300 w-12 h-6 rounded-xl flex mx-2">
        <div className={ getStyle(state) }></div>
        <div className={ getStyle(!state) }></div>
      </button>
      { option2text }
    </div>
  );
}

export default ToggleBtn;