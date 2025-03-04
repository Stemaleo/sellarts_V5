"use client";

import { resetPassword } from "@/actions/auth";
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
import { toast } from "sonner";
import * as Yup from "yup";

export default function LoginPage() {
  const { update } = useSession();
  const { execute, loading } = useActions();
  const t = useTranslations("loginPage");
  const router = useRouter();
  const params = useSearchParams();
  const form = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    async onSubmit(values, formikHelpers) {
      execute(resetPassword, values.email).then((res) => {
        if (res?.success) {
          toast.success("Password Reset Successfully");
          router.replace("/login");
        }
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Image width={250} alt="logo" src={logo} />
          <CardTitle className="text-3xl font-bold mt-4">{t("password-reset")}</CardTitle>
          <CardDescription>{t("enter-your-registered-email-address-a-new-password-will-be-sent-to-your-mail-address")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit}>
            {params.has("error") && <div className="text-sm text-center text-red-500">{t("login-failed-check-your-credentials")}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" onChange={form.handleChange} onBlur={form.handleBlur} name="email" value={form.values.email} type="email" />
              <ErrorMessage error={form.errors.email} touched={form.touched.email} />
            </div>
            <Button disabled={!form.dirty || loading} loading={loading} className="w-full" type="submit">
              {t("reset-password-0")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href={"/login"} className="text-primary hover:underline">
              {t("signin")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
