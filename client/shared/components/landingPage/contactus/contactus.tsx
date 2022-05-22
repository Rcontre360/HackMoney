import * as React from "react";
import { useModal } from "@shared/hooks/modal";
import { useForm } from "react-hook-form";
import { Button } from "@shared/components/common/button";
import { InputText } from "@shared/components/common/form/input-text";
import { InputEmail } from "@shared/components/common/form/input-email";
import { InputTextArea } from "@shared/components/common/form/text-area";
import { InputPhone } from "@shared/components/common/form/input-phone/input-phone";
import clsx from "clsx";
import Styles from "./styles.module.scss";

export const Contactus: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { Modal, show, isShow, hide } = useModal();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: any) => {
    hide();
  };

  const rules = {
    fullName: {
      required: { value: true, message: "This is required" },
    },
    lastname: {
      required: { value: true, message: "This is required" },
    },
    email: {
      required: { value: true, message: "This is required" },
    },
    phoneNumber: {
      required: { value: true, message: "This is required" },
    },
    message: {
      required: { value: true, message: "This is required" },
    },
  };

  return (
    <>
      <Modal isShow={isShow}>
        <div
          className={clsx("flex flex-col w-full h-full sm:px-10 px-4 pb-10")}
        >
          <h1 className="text-[25px] font-bold mb-14 text-white">Contact us</h1>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex md:flex-row flex-col">
              <InputText
                name="fullName"
                title="Full name *"
                placeholder="John"
                register={register}
                rules={rules.fullName}
                error={errors.fullName}
                classNameContainer="md:max-w-[472px] md:mr-10 f-22 w-full"
              />
              <InputPhone
                name="phoneNumber"
                title="Phone number *"
                placeholder="+48 154 8156 1478"
                register={register}
                rules={rules.phoneNumber}
                error={errors.phoneNumber}
                className="md:max-w-[472px] f-22 w-full"
                setValueInput={setValue}
              />
            </div>
            <div className="flex md:flex-row flex-col">
              <InputEmail
                name="email"
                title="Email Address *"
                placeholder="Jhondoe@example.com"
                register={register}
                rules={rules.email}
                error={errors.email}
                classNameContainer="md:max-w-[472px] md:mr-10 f-22 w-full"
              />
              <InputTextArea
                name="message"
                title="Message"
                placeholder="Hello ChainScore..."
                register={register}
                className="md:max-w-[460px] f-22 w-full"
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="md:mt-[76px] mt-10 px-[46px] py-[13px] font-semibold f-22"
                label={isLoading ? "Loading" : "Send"}
                type="submit"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </Modal>
      <div className={clsx("py-10 text-center", Styles.containerContact)}>
        <p
          className={clsx(
            "font-normal text-color1 leading-[24px]",
            Styles.text
          )}
        >
          Let us know how we can help you. Contact us for additional information
          and requests.
        </p>
        <Button className="mt-6 font-semibold" onClick={() => show()}>
          Contact us
        </Button>
      </div>
    </>
  );
};
