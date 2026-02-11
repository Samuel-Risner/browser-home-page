function ErrorMsg(
  { msg, delFunction }:
  { msg: string, delFunction: () => void }
) {
  return (
    <div className="bg-white flex flex-row gap-4 pr-2 pl-3 rounded-xl">
      <button onClick={ delFunction }>x</button>
      <div>{ msg }</div>
    </div>
  );
}

export default ErrorMsg;