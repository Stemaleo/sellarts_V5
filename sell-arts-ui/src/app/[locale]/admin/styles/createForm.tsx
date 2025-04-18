"use client";

import * as React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CREATE_STYLE } from "@/actions/mutation/admin/stylesType/createMutation";

export default function CreateForm({onCreateSuccess}: {onCreateSuccess: () => void}) {
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
    }),
    async onSubmit(values, formikHelpers) {
      formikHelpers.setSubmitting(true);
      
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
          query: CREATE_STYLE,
          variables: {
            name: values.name,
          },
        });

        const res = response.data.data.featureCreateStyle;
        
        if (res.success) {
          formikHelpers.resetForm();
          toast.success("Created...");
          onCreateSuccess();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("An error occurred while creating the style.");
      }
      
      formikHelpers.setSubmitting(false);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Styles Management</CardTitle>
        <CardDescription>Add, remove, and manage styles for your art selling platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">New Style</Label>
            <div className="flex space-x-2">
              <div className="w-full">
                <Input
                  id="name"
                  placeholder="Enter style name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <ErrorMessage error={form.errors.name} touched={form.touched.name} />
              </div>
              <Button disabled={form.isSubmitting} type="submit">
                <Plus className="mr-2 h-4 w-4" /> Add Style
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
