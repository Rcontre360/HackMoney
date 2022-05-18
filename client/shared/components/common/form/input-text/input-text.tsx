import * as React from "react";
import { Input } from "../../form/input";
import { InputProps } from "../../../../interfaces/common";

export const InputText: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ ...props }) => {
  return (
    <>
      <Input type="text" {...props}></Input>
    </>
  );
};
