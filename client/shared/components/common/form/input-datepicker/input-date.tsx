import * as React from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import clsx from 'clsx';
import Styles from './datepicker.module.scss';
import { Typography } from "../../typography";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export const InputDatePicker: React.FC<any> = ({
  values,
  setValues,
  // disabled,
  title,
  error,
  className,
}) => {
  React.useEffect(() => {
    document.querySelector(".rmdp-container")?.classList.add("w-full");
  }, []);

  const destructuringDate = (date: string) => {
    let newDate = date.substring(0, 10);
    const dateSubmit = new Date(newDate + " 00:00");
    return dateSubmit;
  };

  const addDays = function (date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return new DateObject(date);
  };

  return (
    <div className="flex w-full flex-col relative">
      <Typography
        type="label"
        className={clsx("font-bold", { "text-status-error": error?.error })}
      >
        {title}
      </Typography>
      <DatePicker
        value={values ? values[0] : ""}
        onChange={(e: any) => {
          var date;
          if (e[0]) {
            date = new Date(e?.toString());
            // date = addDays(date, 29);
            // console.log("e", e[0], "date", date);
            setValues([e[0]]);
          }
        }}
        mapDays={({ date }) => {
          const today = new Date();
          const day = new Date(date.format("YYYY/MM/DD") + " 23:59:59");
        }}
        render={(value: any, openCalendar: any) => {
          return (
            <div
              className={clsx(
                className,
                Styles.input,
                { "text-color1": value.length != 0 },
                { "text-color1": value.length == 0 },
                { "border-status-error text-status-error": error?.error },
                { "border-color1": value[1] },
                { "border-gray-500": !value[1] && !error?.error },
                "py-3 mt-2 w-full f-17 border  rounded-md"
              )}
              onClick={openCalendar}
            >
              {value.length != 0
                ? value[1] !== undefined
                  ? value[0]
                  : value[0]
                : "Select a Date"}
            </div>
          );
        }}
      />
      {error?.error && (
        <span className={clsx("flex items-center mb-2", "text-status-error")}>
          <div className="mr-1 w-4 h-4">
            <ExclamationCircleIcon
              className={clsx("w-4", "text-status-error")}
            />
          </div>
          <Typography type="smallTitle">{error.message}</Typography>
        </span>
      )}
    </div>
  );
};
