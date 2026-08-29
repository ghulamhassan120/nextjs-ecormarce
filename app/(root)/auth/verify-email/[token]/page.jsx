"use client";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import verifiedImg from '../../../../../public/assets/images/verified.gif'
import verificationFailedImg from '../../../../../public/assets/images/verification-failed.gif'

import Image from "next/image";
import Link from "next/link";
import {WEBSITE_HOME} from '../../../../../Routes/WebsiteRoutes'
const EmailVerification = ({ params }) => {
  const { token } = use(params);
  const [isVerifed, setIsverifed] = useState(false);
  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post(
        "/api/auth/verify-email",{token}
      );
      if (verificationResponse.success) {
        setIsverifed(true);
      }
    };

    verify();
  });
  return (
    <Card className="w-[400px]">
      <CardContent>{isVerifed ?
       <div>
        <div className="flex justify-center items-center">
          <Image src={verifiedImg.src} width={verifiedImg.width} height={verifiedImg.height} className="h-[100px] w-auto" alt="Verification Success"/>
        </div>
        <div className="text-center">
        <h1 className="text-2xl font-bold text-green-500 my-5">Email Verification Success</h1>
        <Button >
          <Link href={WEBSITE_HOME}>Continue Shopping</Link>
        </Button>
        </div>
       </div> :
         <div>
        <div className="flex justify-center items-center">
          <Image src={verificationFailedImg.src} width={verificationFailedImg.width} height={verificationFailedImg.height} className="h-[100px] w-auto" alt="Verification Faild"/>
        </div>
        <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 my-5">Email Verification Failed</h1>
        <Button >
          <Link href={WEBSITE_HOME}>Continue Shopping</Link>
        </Button>
        </div>
       </div> 
       }</CardContent>
    </Card>
  );
};

export default EmailVerification;
