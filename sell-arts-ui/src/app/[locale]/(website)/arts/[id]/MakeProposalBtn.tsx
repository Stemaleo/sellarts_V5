"use client";

import { makeProposal } from "@/actions/bid";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActions } from "@/lib/hooks";
import { ArtWorkDTO } from "@/lib/type";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";
const MakeProposalBtn = ({ artWork }: { artWork: ArtWorkDTO }) => {
  const { loading, execute } = useActions();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const formik = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema: yup.object({
      amount: yup.number().min(10),
    }),
    onSubmit(values, formikHelpers) {
      execute(makeProposal, artWork.id, values.amount).then((res) => {
        if (res?.success) {
          toast.success("Proposal sent to artist.");
          setIsOpen(false);
        }
      });
    },
  });

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(c) => setIsOpen(c)}>
        <DialogTrigger asChild>
          <Button disabled={!artWork.inStock || loading} variant={"secondary"} className="w-full sm:w-auto text-sm sm:text-base">
            {t("p.make-a-proposal")}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] sm:w-[450px] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t("p.make-a-proposal")}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">{t("p.how-much-would-you-like-to-offer-for-this-artwork")}</DialogDescription>
          </DialogHeader>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <Label className="text-sm sm:text-base">{t("common.amount")}</Label>
                <Input type="number" onBlur={formik.handleBlur} onChange={formik.handleChange} name="amount" className="mt-1" />
                <ErrorMessage touched={formik.touched.amount} error={formik.errors.amount} />
              </div>
              <div className="mt-6">
                <Button disabled={loading} loading={loading} className="w-full sm:w-auto">
                  {t("common.submit")}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MakeProposalBtn;
