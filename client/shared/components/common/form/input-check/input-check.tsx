import * as React from "react";
import clsx from "clsx";
import styles from "./input-check.module.scss";
import { Typography } from "../../typography";
import { InputProps } from "../../../../interfaces/common";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export const InputCheck: React.FC<
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ name, register, rules, error, children, className, ...props }) => {
  return (
    <div
      className={clsx(
        className,
        "flex items-start flex-col justify-between w-full"
      )}
    >
      <div className={clsx("flex items-start justify-start w-full")}>
        <div className={clsx("flex items-start justify-start")}>
          <input
            className={clsx(
              styles.checkbox,
              "2xl:h-7 2xl:w-7 w-5 h-5 rounded-md border-color1"
            )}
            type="checkbox"
            id={name}
            name={name}
            {...register(name, rules)}
            {...props}
          />
        </div>
        <Typography type="label" className={"ml-2"}>
          <label
            htmlFor={name}
            className={clsx(
              { "cursor-not-allowed": props.disabled },
              { "cursor-pointer": !props.disabled }
            )}
          >
            {children}
          </label>
        </Typography>
      </div>

      {error && error.message && (
        <span className="flex mt-3 text-status-error font-montserrat">
          <ExclamationCircleIcon className="w-4 mr-1 text-status-error" />
          <Typography type="caption">{error.message}</Typography>
        </span>
      )}
    </div>
  );
};
