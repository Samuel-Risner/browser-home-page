import { useState } from "react";
import ErrorMsg from "./ErrorMsg";

function ErrorContainer(
  { errorsToHandle }:
  { errorsToHandle: string[] }
) {
  const [errors, setErrors] = useState<string[]>([...errorsToHandle]);

  if (errors.length === 0) return (<></>);

  return (
    <div className="border-4 border-red-500 rounded-2xl p-1 absolute left-4 top-4 z-10 flex flex-col gap-2">
      { errors.map((msg, index) => <ErrorMsg
        msg={ msg }
        delFunction={ () => { errors.splice(index, 1); setErrors([...errors]); } }
        key={ index }
      ></ErrorMsg>) }
    </div>
  );
}

export default ErrorContainer;