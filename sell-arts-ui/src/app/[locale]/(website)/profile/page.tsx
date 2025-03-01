"use client";

import { changePassword, getCurrentUserInfo } from "@/actions/auth";
import { updateProfileInfo } from "@/actions/profile";
import ErrorMessage from "@/app/[locale]/ErrorMessage";
import { ProfilePictureUploadComponent } from "@/components/profile-picture-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActions } from "@/lib/hooks";
import { User } from "@/lib/type";
import { error } from "console";
import { useFormik } from "formik";
import { Mail, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { date } from "yup";
import * as Yup from "yup";
export default function UserProfilePage() {
  const { execute, data, loading, error } = useActions<User>();
  const { execute: executePassword, loading: loadingPassword } = useActions();
  const { update, data: session } = useSession();
  const t = useTranslations();
  const form = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required().min(3),
    }),
    async onSubmit(values, formikHelpers) {
      const res = await execute(updateProfileInfo, values);
      if (res?.success) {
        toast.warning("Updated");
        console.log(res.data);
        update({
          user: res.data,
        });
      }
      setIsEditing(false);
    },
  });

  useEffect(() => {
    execute(getCurrentUserInfo).then((res) => {
      if (res?.success) {
        form.setFieldValue("name", res.data.name);
        form.setTouched({ name: false });
      }
    });
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditToggle = (e: any) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required().min(8),
      confirmPassword: Yup.string().oneOf([Yup.ref("password")], t("common.passwords-must-match")),
    }),
    onSubmit(values, formikHelpers) {
      executePassword(changePassword, values.password).then((res) => {
        if (res?.success) {
          toast.success("Password updated");
        }
      });
    },
  });

  if (loading && data == null) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="container mx-auto  py-8 space-y-6">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-10 md:gap-4">
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex items-center space-x-2">
                <UserIcon className="text-muted-foreground" />
                <Input id="name" name="name" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} disabled={!isEditing} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="text-muted-foreground" />
                <Input id="email" name="email" type="email" value={data?.email} disabled={true} />
              </div>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button disabled={!form.dirty || loading}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={handleEditToggle}>Edit Profile</Button>
              )}
            </div>
          </form>
          <div className="flex justify-center items-center">
            <ProfilePictureUploadComponent
              onUpdate={(url: string) => {
                update({
                  ...session,
                  user: {
                    ...session?.user,
                    profileImageUrl: url,
                  },
                });
              }}
              previewUrl={data?.profileImageUrl}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-md pt-4">
            <h2 className="text-2xl font-bold">{t("change-password")}</h2>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("current-password")}</Label>
              <Input id="currentPassword" name="password" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <ErrorMessage error={formik.errors.password} touched={formik.touched.password} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("current-password")}</Label>
              <Input id="currentPassword" name="confirmPassword" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <ErrorMessage error={formik.errors.confirmPassword} touched={formik.touched.confirmPassword} />
            </div>
            <Button type="submit" disabled={loadingPassword} loading={loadingPassword} className="w-full">
              {t("change-password")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
