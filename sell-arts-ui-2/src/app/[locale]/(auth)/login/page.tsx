"use client";

import logo from "@/assets/logo.png";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActions } from "@/lib/hooks";
import { useFormik } from "formik";
import { Paintbrush } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

export default function LoginPage() {
  const { update } = useSession();
  const t = useTranslations("loginPage");
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Min 6 characters required").required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    async onSubmit(values, formikHelpers) {
      formikHelpers.setSubmitting(true);
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: true,
        callbackUrl: params.get("callback") || "/",
        ...values,
      });
      setLoading(false);
      console.log(res);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Image width={300} alt="logo" src={logo} />
          <CardTitle className="text-3xl font-bold">{t("welcome")}</CardTitle>
          <CardDescription>{t("enterCredentials")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit}>
            {params.has("error") && <div className="text-sm text-center text-red-500">{t("login-failed-check-your-credentials")}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" onChange={form.handleChange} onBlur={form.handleBlur} name="email" value={form.values.email} type="email" />
              <ErrorMessage error={form.errors.email} touched={form.touched.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.password} type="password" />
              <ErrorMessage error={form.errors.password} touched={form.touched.password} />
            </div>
            <Button loading={loading} disabled={!form.dirty || form.isSubmitting} className="w-full" type="submit">
              {t("signin")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/forgot" className="text-primary hover:underline">
              {t("forgotPassword")}
            </Link>
          </div>
          <div className="mt-6 text-center text-sm">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline">
              {t("signup")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
