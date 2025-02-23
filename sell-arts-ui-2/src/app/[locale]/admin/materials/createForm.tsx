"use client";

import * as React from "react";
import { useState } from "react";
import { Paintbrush, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useFormik } from "formik";
import * as yup from "yup";
import ErrorMessage from "@/components/ErrorMessage";
import { createPaintingType } from "@/actions/paintingType";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createMaterialType } from "@/actions/materialType";
export default function CreateForm() {
  const router = useRouter();
  const form = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Name is required"),
    }),
    async onSubmit(values, formikHelpers) {
      form.setSubmitting(true);
      const res = await createMaterialType(values.name);
      formikHelpers.setSubmitting(false);
      if (res.success) {
        formikHelpers.resetForm();
        toast.success("Created...");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Types Management</CardTitle>
        <CardDescription>Add, remove, and manage Material types for your art selling platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">New Material Type</Label>
            <div className="flex space-x-2">
              <div className="w-full">
                <Input id="name" placeholder="Enter material type name" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} />
                <ErrorMessage error={form.errors.name} touched={form.touched.name} />
              </div>
              <Button disabled={form.isSubmitting} type="submit">
                <Plus className="mr-2 h-4 w-4" /> Add Type
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
