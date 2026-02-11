import { useState } from "react";
import CONSTANTS from "../../constants";

function checkPassword(pswd: string): boolean {
  if (pswd.length < CONSTANTS.PASSWORD.MIN_LENGTH) return false;
  if (pswd.length > CONSTANTS.PASSWORD.MAX_LENGTH) return false;

  return true;
}

function InputPassword (
  { submit }:
  { submit: (pswd: string) => void }
) {
  const [password, setPassword] = useState<string>("");
  const [validInput, setValidInput] = useState<boolean>(false);

  const updatePassword = (pswd: string) => {
    setPassword(pswd);
    setValidInput(checkPassword(pswd));
  }

  const maybeSubmit = () => {
    if (checkPassword(password)) submit(password);
  }

  return (
    <div>
      <input type="password" value={ password } onChange={ (e) => updatePassword(e.target.value) }></input>
      <button disabled={ !validInput } onClick={ maybeSubmit }>Submit</button>
      <div>
        <div>Password requirements:</div>
        <div>Minimum length { CONSTANTS.PASSWORD.MIN_LENGTH }</div>
        <div>Maximum length { CONSTANTS.PASSWORD.MAX_LENGTH }</div>
      </div>
    </div>
  );
}

export default InputPassword;