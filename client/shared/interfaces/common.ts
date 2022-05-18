import React from "react";
import { ErrorOption } from "react-hook-form";

export interface InputProps {
  name: string;
  colorErrorHide?: boolean;
  isFill?: boolean;
  optional?: boolean;
  NoterrorMessage?: boolean;
  title?: string;
  customPlaceholder?: string;
  classNameContainer?: string;
  prefix?: string;
  sufix?: string;
  register?: any;
  textArea?: boolean;
  rules?: Record<string, unknown>;
  rightImg?: React.ReactNode;
  leftImg?: React.ReactNode;
  hideTitle?: boolean;
  rightClick?: () => void;
  leftClick?: () => void;
  onChangeState?: (val: any) => void;
  arrayValues?: any[];
  labelVisible?: boolean;
  error?: any;
  setValueInput?: (
    name: string,
    value: any,
    config?: Partial<{
      shouldValidate: boolean;
      shouldDirty: boolean;
    }>
  ) => void;
  onChangeCustom?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCustomTextArea?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setError?: (name: string, error: ErrorOption) => void;
}
