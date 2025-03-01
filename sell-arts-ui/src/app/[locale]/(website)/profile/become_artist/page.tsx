"use client";

import { useState } from "react";
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
import { registerArtistProfile } from "@/actions/profile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
export default function CreateArtistProfilePage() {
  const { update, data } = useSession();

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
      const res = await registerArtistProfile(values);
      if (res.success) {
        toast.success("Profile Created");
        update({
          ...data,
          user: res.data,
        });
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
    <div className="container mx-auto py-8">
      <Card className="shadow-none border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-start">
            <Paintbrush className="mr-2" />
            Create Your Artist Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="space-y-2">
                  <Input id="location" name="location" value={form.values.location} onChange={form.handleChange} onBlur={form.handleBlur} />
                  <ErrorMessage error={form.errors.location} touched={form.touched.location} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                <div className="space-y-2">
                  <Input id="portfolioUrl" name="portfolioUrl" value={form.values.portfolioUrl} onChange={form.handleChange} onBlur={form.handleBlur} placeholder="https://your-portfolio.com" />
                  <ErrorMessage error={form.errors.portfolioUrl} touched={form.touched.portfolioUrl} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={form.values.bio} onChange={form.handleChange} onBlur={form.handleBlur} rows={4} />
              <ErrorMessage error={form.errors.bio} touched={form.touched.bio} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artStyle">Primary Art Style</Label>
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
              Create Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
