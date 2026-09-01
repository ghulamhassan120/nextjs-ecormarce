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
import { WEBSITE_REGISTER } from "../../../../Routes/WebsiteRoutes";
import axios from "axios";
import { showToast } from "../../../../lib/showToast";
import OtpValidation from "../../../../components/Application/otpValidation";
import { useDispatch } from "react-redux";
import {login} from '../../../../store/reducer/authReducer'
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState();
  const [otpEmail, setOtpEmail] = useState("")  
  const dispatch=useDispatch()
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min("3", "password field must be required"),
    });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const HandleLoginSubmit = async (values) => {
    console.log(values);
    
 try {
        setLoading(true)
        const {data:loginResponse}=await axios.post(`/api/auth/login`,values)
        console.log(loginResponse);
        
        if (!loginResponse?.success) {
          throw new Error(loginResponse.message)
        }
        setOtpEmail(values?.email)
        form.reset()
        showToast('success',loginResponse.message)
      } catch (error) {
        showToast('error',error.message)
      }finally{
        setLoading(false)
      }
  };

    const handleOtpVerification = async (values) => {
           try {
        setOtpVerificationLoading(true)
        const {data:otpResponse}=await axios.post(`/api/auth/verify-otp`,values)
        console.log(otpResponse);
        
        if (!otpResponse?.success) {
          throw new Error(otpResponse.message)
        }
        setOtpEmail('')
        showToast('success',otpResponse.message)
        dispatch(login(otpResponse.data))
      } catch (error) {
        showToast('error',error.message)
      }finally{
        setOtpVerificationLoading(false)
      }

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
        {!otpEmail
          ?
          <>    <div className="text-center">
          <h1 className="text-3xl font-bold">Login Into Account</h1>
          <p> Login into your account by filling out the form below</p>
        </div>

        <form onSubmit={form.handleSubmit(HandleLoginSubmit)}>
          <FieldSet>
            <FieldGroup>
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
            </FieldGroup>
          </FieldSet>
          <div className="mt-4 mb-3">
            <ButtonLoading
              type={"submit"}
              text="Login"
              loading={loading}
              className={"w-full cursor-pointer"}
            />
          </div>
          <div className="text-center ">
            <div className="flex justify-center items-center gap-1">
                  <p>Don't have account?</p>
                  <Link href={WEBSITE_REGISTER} className="text-primary underline">Create Account</Link>
            </div>
            <div className="mt-3">
                  <Link href="" className="text-primary underline">Forget Password</Link>
            </div>
          </div>
        </form></>
          :
          <>
          <OtpValidation email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification}/>
           </>
        }
    
      </CardContent>
    </Card>
  );
};

export default LoginPage;
