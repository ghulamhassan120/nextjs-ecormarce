import React from "react";
import { zSchema } from "../../lib/zodSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonLoading from "./ButtonLoading";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
const OtpValidation = ({ email, onSubmit, loading }) => {
  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpVerification = async (values) => {
    onSubmit(values);
  };
  return (
    <div>
      <form onSubmit={form.handleSubmit(handleOtpVerification)}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Please Complete Verification
          </h1>
          <p className="text-md">
            We have sent an One-time Password (OTP) to your registered email
            address. The OTP is valid for 10 minutes only.
          </p>
        </div>
        <FieldSet>
          <FieldGroup>
         <Controller
  name="otp"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field className="mt-2">
      <FieldLabel htmlFor="otp" className="justify-center">
        One-time Password (OTP)
      </FieldLabel>

      <div className="flex justify-center">
        <InputOTP
          id="otp"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        >
          <InputOTPGroup>
            <InputOTPSlot className="size-10 text-xl" index={0} />
            <InputOTPSlot className="size-10 text-xl" index={1} />
            <InputOTPSlot className="size-10 text-xl" index={2} />
            <InputOTPSlot className="size-10 text-xl" index={3} />
            <InputOTPSlot className="size-10 text-xl" index={4} />
            <InputOTPSlot className="size-10 text-xl" index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {fieldState.error && (
        <FieldError className="justify-center text-center">
          {fieldState.error.message}
        </FieldError>
      )}
    </Field>
  )}
/>
          </FieldGroup>
        </FieldSet>
        <div className="mt-4 mb-3">
          <ButtonLoading
            type={"submit"}
            text="Verify"
            loading={loading}
            className={"w-full cursor-pointer"}
          />
          <div className="text-center mt-5 ">
            <button
              type="button"
              className="cursor-pointer text-blue-500 hover:underline"
      >
              Resend OTP
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OtpValidation;
