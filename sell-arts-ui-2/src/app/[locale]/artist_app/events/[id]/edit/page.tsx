"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useFormik } from "formik";
import ErrorMessage from "@/components/ErrorMessage";
import * as yup from "yup";
import { toast } from "sonner";
import { createArtWork } from "@/actions/artwork";
import { useActions } from "@/lib/hooks";
import { ArtWork, MaterialType, PaintingType } from "@/lib/type";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getAllMaterialTypes } from "@/actions/materialType";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { hasRole } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { createEvent } from "@/actions/events";
export default function CreateArtwork() {
  const [images, setImages] = useState<File[]>([]);
  const params = useSearchParams();
  const { data, execute, loading } = useActions<ArtWork>();
  const { data: session } = useSession();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => file);
      if (images.length + newImages.length > 3) {
        toast.error("Only 3 images are allowed");
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const form = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      maxRegistration: 0,
      endDate: undefined,
    },
    validationSchema: yup.object({
      title: yup.string().required().max(50),
      description: yup.string().required().min(50),
      location: yup.string().required().min(3),
      maxRegistration: yup.number().required(),
      endDate: yup.date().required(),
    }),
    async onSubmit(values, formikHelpers) {
      if (images.length == 0) {
        toast.error("Images is required to create a art work.");
        return;
      }
      const res = await execute(createEvent, values, images);
      if (res?.success) {
        toast.success("Created...");
        formikHelpers.resetForm();
        setImages([]);
      }
    },
  });

  return (
    <div className="container mx-auto ">
      <Card className="shadow-none border-0 p-0 m-0">
        <CardHeader className="p-0 pb-8">
          <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-8">
          <form className="space-y-6" onSubmit={form.handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} placeholder="Title" />
              <ErrorMessage error={form.errors.title} touched={form.touched.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" onChange={form.handleChange} value={form.values.description} onBlur={form.handleBlur} placeholder="Description" />
              <ErrorMessage error={form.errors.description} touched={form.touched.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" onChange={form.handleChange} value={form.values.location} onBlur={form.handleBlur} placeholder="Enter location" />
              <ErrorMessage error={form.errors.location} touched={form.touched.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRegistration">Max Registrations</Label>
              <Input id="maxRegistration" type="number" name="maxRegistration" onChange={form.handleChange} value={form.values.maxRegistration} onBlur={form.handleBlur} placeholder="Enter max registrations" />
              <small className="text-slate-500">Enter 0 for unlimited registrations</small>
              <ErrorMessage error={form.errors.maxRegistration} touched={form.touched.maxRegistration} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRegistration">Date</Label>
              <Input id="end" type="datetime-local" name="endDate" onChange={form.handleChange} value={form.values.endDate ?? ""} onBlur={form.handleBlur} placeholder="Enter max registrations" />

              <ErrorMessage error={form.errors.endDate} touched={form.touched.endDate} />
            </div>

            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
                </label>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Button disabled={loading} loading={loading} className="w-full mt-6 block">
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
