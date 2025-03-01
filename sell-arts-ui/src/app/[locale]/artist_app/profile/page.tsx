"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Paintbrush, User, MapPin, Link, Camera, Palette, Instagram, Twitter } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "@/app/[locale]/ErrorMessage";
import { getArtistProfile, registerArtistProfile, updateArtistProfile } from "@/actions/profile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ImageUpload } from "./uploadImage";
import { ArtistProfile } from "@/lib/type";
import { useTranslations } from "next-intl";

export default function CreateArtistProfilePage() {
  const { update, data } = useSession();
  const [profile, setProfile] = useState<ArtistProfile>();
  const t = useTranslations();
  useEffect(() => {
    getArtistProfile().then((res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setProfile(res.data);
      console.log(res.data);
      form.setFieldValue("bio", res.data.bio ?? "");
      form.setFieldValue("location", res.data.location ?? "");
      form.setFieldValue("portfolioUrl", res.data.portfolioUrl ?? "");
    });
  }, []);

  const form = useFormik({
    initialValues: {
      bio: "",
      location: "",
      portfolioUrl: "",
    },
    validationSchema: Yup.object({
      bio: Yup.string().min(10).required(),
      portfolioUrl: Yup.string(),
      location: Yup.string().required(),
    }),
    async onSubmit(values, formikHelpers) {
      const res = await updateArtistProfile(values);
      if (res.success) {
        toast.warning("Profile Updated");

        return;
      }

      if (res.message) {
        toast.error(res.message);
      }

      res.errors.forEach((e) => {
        formikHelpers.setFieldError(e.field, e.errorMessage);
      });
    },
  });

  const handleInfoChange = (e: any) => {};

  return (
    <div className="c">
      <div className="">
        <div className="">
          <div className="bg-white shadow rounded-lg ">
            <div className="relative h-48 sm:h-64">
              {profile && <ImageUpload type="cover" initialImage={profile.coverUrl} className="w-full h-full" />}
              {profile && profile.userInfo && <ImageUpload type="profile" initialImage={profile?.userInfo?.profileUrl ?? "https://placehold.co/600x400/png?text=Profile+Image"} className="absolute bottom-0 translate-y-[50%] left-4 h-32 w-32 rounded-full border-2 overflow-hidden" />}
            </div>
            <div className="px-4 py-5 sm:p-6"></div>
            <form className="space-y-4 mt-6 p-4" onSubmit={form.handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">{t("location")}</Label>
                  <div className="space-y-2">
                    <Input id="location" name="location" value={form.values.location} onChange={form.handleChange} onBlur={form.handleBlur} />
                    <ErrorMessage error={form.errors.location} touched={form.touched.location} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">{t("portfolio-url")}</Label>
                  <div className="space-y-2">
                    <Input id="portfolioUrl" name="portfolioUrl" value={form.values.portfolioUrl} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="https://your-portfolio.com" />
                    <ErrorMessage error={form.errors.portfolioUrl} touched={form.touched.portfolioUrl} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">{t("bio")}</Label>
                <Textarea id="bio" name="bio" value={form.values.bio} onChange={form.handleChange} onBlur={form.handleBlur} rows={4} />
                <ErrorMessage error={form.errors.bio} touched={form.touched.bio} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artStyle">{t("primary-art-style")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary art style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="realism">Realism</SelectItem>
                    <SelectItem value="impressionism">Impressionism</SelectItem>
                    <SelectItem value="surrealism">Surrealism</SelectItem>
                    <SelectItem value="pop-art">Pop Art</SelectItem>
                    <SelectItem value="digital">Digital Art</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button disabled={!form.dirty} type="submit" className="w-full">
                {t("update-profile")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
