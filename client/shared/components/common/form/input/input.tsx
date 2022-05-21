import * as React from "react";
// import { ExclamationCircleIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import styles from "./input.module.scss";
import { Typography } from "../../typography";
import { InputProps } from "../../../../interfaces/common";

export const Input: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  name,
  title,
  isFill,
  register,
  rules,
  rightImg,
  leftImg,
  rightClick,
  leftClick,
  error,
  className,
  classNameContainer,
  customPlaceholder,
  onChangeCustom,
  onChangeCustomTextArea,
  textArea = false,
  colorErrorHide = false,
  ...props
}) => {
  // const registerInput = register(name, rules);
  return (
    <div className={clsx("relative flex flex-col w-full", classNameContainer)}>
      <div className={clsx(styles.input)}>
        <Typography
          type="label"
          className={clsx({ "text-status-error": error })}
        >
          {title}
        </Typography>

        <input
          id={name}
          // {...registerInput}
          onChange={(e) => {
            // registerInput.onChange(e);
            onChangeCustom && onChangeCustom(e);
          }}
          // onBlur={registerInput.onBlur}
          placeholder={customPlaceholder}
          autoComplete="off"
          className={clsx(
            className,
            {
              "border-status-error placeholder-status-error text-status-error":
                error && !colorErrorHide,
            },
            { [`${styles.marginInput}`]: !error },
            { "px-4": !leftImg && !rightImg },
            { "pl-9 pr-4": leftImg },
            { "pr-9 pl-4": rightImg },

            { "bg-transparent border-gray-500 ": !isFill },
            {
              "bg-transparent-color-gray-200 border-color1": isFill && !error,
            },
            !!isFill && styles.inputDateWithValue,
            styles.inputStyles,
            "py-3 placeholder-color1 mt-2 w-full text-color1 f-17 border rounded-md",
            "disabled:placeholder-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-800",
            "focus:outline-none focus:bg-transparent focus:ring-offset-transparent focus:ring-opacity-0 focus:border-gray-5 focus:ring-white"
          )}
          {...props}
        />

        {error && error.message && (
          <span
            className={clsx("flex items-center mt-2", {
              "text-status-error": !colorErrorHide,
            })}
          >
            <div className="mr-1 w-4 h-4">
              {/* <ExclamationCircleIcon
                className={clsx("w-4", {
                  "text-status-error": !colorErrorHide,
                })}
              /> */}
            </div>
            <Typography type="smallTitle">{error.message}</Typography>
          </span>
        )}
        {leftImg && (
          <div onClick={leftClick} className="absolute left-7 top-12 w-4 h-3">
            {leftImg}
          </div>
        )}
        {rightImg && (
          <div onClick={rightClick} className="absolute right-4 top-12 w-4 h-3">
            {rightImg}
          </div>
        )}
      </div>
    </div>
  );
};
