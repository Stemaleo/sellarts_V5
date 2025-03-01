"use client";

import ErrorMessage from "@/app/[locale]/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import SearchAndSelectArts from "./SearchAndSelectArts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArtWorkDTO } from "@/lib/type";
import Image from "next/image";
import { toast } from "sonner";
import { useActions } from "@/lib/hooks";
import { createCatalog } from "@/actions/catalog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const CreateCatalogue = () => {
  const [selected, setSelected] = useState<ArtWorkDTO[]>([]);
  const { execute, loading } = useActions();
  const router = useRouter();
  const t = useTranslations();
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit(values, formikHelpers) {
      if (selected.length == 0) {
        toast.error("Please select a artwork");
        return;
      }

      const ids = selected.map((s) => s.id);
      execute(createCatalog, {
        ...values,
        artWorkIds: ids,
      }).then((res) => {
        if (res?.success) {
          toast.success("Created...");
          router.back();
        }
      });
    },
  });

  return (
    <div>
      <Card className="">
        <CardHeader className=" pb-8">
          <CardTitle className="text-2xl font-bold">{t("create-catalogue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <Label>{t("catalogue-name")}</Label>
              <Input name="name" onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <ErrorMessage error={formik.errors.name} touched={formik.touched.name} />
            </div>
            <div>
              <Label>{t("description")}</Label>
              <Textarea name="description" onChange={formik.handleChange} onBlur={formik.handleBlur} />
              <ErrorMessage error={formik.errors.name} touched={formik.touched.name} />
            </div>
            <div>
              <h4>
                {t("selected-artworks")} {selected.length}
              </h4>
              <div className="mt-2 flex gap-4 flex-wrap">
                {selected.map((s) => {
                  return <Image key={s.id + "img"} alt="" src={s.mediaUrls[0]} width={50} height={50} className="rounded aspect-square" />;
                })}
              </div>
            </div>
            <div>
              <Button disabled={loading} loading={loading}>
                {t("create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t("select-artwork")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchAndSelectArts
            selected={selected}
            onSelect={(art) => {
              setSelected([...selected, art]);
            }}
            onRemove={(art) => {
              setSelected(selected.filter((c) => c.id != art.id));
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCatalogue;
