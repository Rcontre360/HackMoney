import * as React from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import clsx from 'clsx';
import Styles from './datepicker.module.scss';
import { Typography } from 'components/common/typography';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

export const InputDatePicker: React.FC<any> = ({
	values,
	setValues,
	disabled,
	title,
	error,
	className,
}) => {
	React.useEffect(() => {
		document.querySelector('.rmdp-container')?.classList.add('w-full');
	}, []);

	const destructuringDate = (date: string) => {
		let newDate = date.substring(0, 10);
		const dateSubmit = new Date(newDate + ' 00:00');
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
        className={clsx("font-bold", { "text-status-error": error.error })}
      >
        {title}
      </Typography>
      <DatePicker
        value={values}
        onChange={(e: any) => {
          var date;
          if (e[0]) {
            date = new Date(e?.toString());
            date = addDays(date, 29);
            console.log("e", e[0], "date", date);
            setValues([e[0], date]);
          }
        }}
        mapDays={({ date }) => {
          const today = new Date();
          const day = new Date(date.format("YYYY/MM/DD") + " 23:59:59");

          const hola = disabled.map((range: any) => {
            return (
              destructuringDate(range.start) <=
                new Date(date.format("YYYY/MM/DD") + " 00:00") &&
              new Date(date.format("YYYY/MM/DD")) <=
                destructuringDate(range.end)
            );
          });
          if (
            day < today ||
            (hola.length > 0 &&
              hola.reduce((acc: boolean, current: boolean) => {
                return acc || current;
              }))
          ) {
            return {
              disabled: true,
              style: { color: "#ccc" },
            };
          }
        }}
        range
        render={(value: any, openCalendar: any) => {
          return (
            <div
              className={clsx(
                className,
                Styles.input,
                { "text-gray-8": value.length != 0 },
                { "text-gray-5": value.length == 0 },
                { "border-status-error text-status-error": error.error },
                { "border-color1": value[1] },
                { "border-gray-1": !value[1] && !error.error },
                "py-3 mt-2 w-full f-17 border  rounded-md"
              )}
              onClick={openCalendar}
            >
              {value.length != 0
                ? value[1] !== undefined
                  ? value[0] + "-" + value[1]
                  : value[0]
                : "Select a Date"}
            </div>
          );
        }}
      />
      {error.error && (
        <span className={clsx("flex items-center mb-2", "text-status-error")}>
          <div className="mr-1 w-4 h-4">
            <ExclamationCircleIcon
              className={clsx("w-4", "text-status-error")}
            />
          </div>
          <Typography type="smallTitle">{error.message}</Typography>
        </span>
      )}

      <div
        className={clsx(
          Styles.tooltip,
          "absolute flex items-center justify-center text-white right-4 2xl:w-6 2xl:h-6 w-5 h-5 f-14",
          "rounded-full bg-color1 cursor-pointer"
        )}
      >
        !{" "}
        <p className={clsx(Styles.tooltiptext)}>
          Choose the date from which you want to move
        </p>
      </div>
    </div>
  );
};
