"use client";

import { createPromo } from "@/actions/promo";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useActions } from "@/lib/hooks";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddView = () => {
  const [open, setOpen] = useState(false);
  const { execute, data, loading } = useActions();
  const t = useTranslations();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      amount: 0,
      code: "",
    },
    onSubmit(values, formikHelpers) {
      execute(createPromo, values.code, values.amount).then((res) => {
        if (res?.success) {
          setOpen(false);
          formikHelpers.resetForm();
          router.refresh();
        }
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={(c) => setOpen(c)}>
      <SheetTrigger asChild>
        <Button>{t("add-new")}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("add-new-promo-code")}</SheetTitle>
        </SheetHeader>
        <form onSubmit={formik.handleSubmit} className="mt-6 grid gap-4">
          <div>
            <Label>{t("code")}</Label>
            <Input name="code" onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </div>
          <div>
            <Label>{t("common.amount")}</Label>
            <Input name="amount" type="number" onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </div>
          <div>
            <Button disabled={loading} loading={loading} type="submit">
              {t("add-new")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddView;
