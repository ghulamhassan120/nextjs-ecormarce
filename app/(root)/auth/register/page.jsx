"use client";
import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import Logo from "../../../../public/assets/images/logo-black.png";
import Image from "next/image";
import { zSchema } from "../../../../lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import ButtonLoading from "../../../../components/Application/ButtonLoading";
import z from "zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { WEBSITE_LOGIN } from "../../../../Routes/WebsiteRoutes";
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const formSchema = zSchema
    .pick({
      name:true,
      email: true,
      password:true,
    }).extend({
      confirmPassword:z.string()
    }).refine((data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
    
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const HandleRegisterSubmit = async (value) => {
    console.log(value);
  };
  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="logo"
            className="max-w-[150px]"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p> create new account by filling out the form below</p>
        </div>

        <form onSubmit={form.handleSubmit(HandleRegisterSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  autoComplete="off"
                  type="text"
                  placeholder="Enter Your FullName"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  autoComplete="off"
                  type="email"
                  placeholder="example@gamil.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>
              <Field className="relative">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  autoComplete="off"
                  type={isTypePassword ? "password" : "text"}
                  placeholder="Enter Your Password"
                  {...form.register("password")}
                />{" "}
                <button
                  type="button"
                  className="absolute top-[60%] left-85 cursor-pointer"
                  onClick={() => setIsTypePassword(!isTypePassword)}
                >
                  {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>
              <Field className="relative">
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  autoComplete="off"
                  type={isTypePassword ? "password" : "text"}
                  placeholder="Enter Your Confirm Password"
                  {...form.register("confirmPassword")}
                />{" "}
                <button
                  type="button"
                  className="absolute top-[60%] left-85 cursor-pointer"
                  onClick={() => setIsTypePassword(!isTypePassword)}
                >
                  {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
                {form.formState.errors.confirmPassword && (
                  <FieldError>
                    {form.formState.errors.confirmPassword.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="mt-4 mb-3">
            <ButtonLoading
              type={"submit"}
              text="Create Account"
              loading={loading}
              className={"w-full cursor-pointer"}
            />
          </div>
          <div className="text-center ">
            <div className="flex justify-center items-center gap-1">
                  <p>Already have account?</p>
                  <Link href={WEBSITE_LOGIN} className="text-primary underline">Login</Link>
            </div>
         
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage