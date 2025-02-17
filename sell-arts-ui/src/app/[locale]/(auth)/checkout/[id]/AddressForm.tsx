"use client";

import { updateOrderAddress } from "@/actions/cart";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActions } from "@/lib/hooks";
import { Order } from "@/lib/type";
import { useFormik } from "formik";
import { Lock } from "lucide-react";
import axios from "axios";
import { INITIATE_PAYMENT_MUTATION } from "@/actions/mutation/payement/mutationPayement";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as yup from "yup";
import { useState } from "react";

const AddressForm = ({ order }: { order: Order }) => {
  const { execute, loading } = useActions();
  const router = useRouter();
  const [paymentLink, setPaymentLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingPaymentLink, setLoadingPaymentLink] = useState(false);

  const form = useFormik({
    initialValues: {
      email: order.owner?.email ?? "",
      name: order.owner?.name ?? "",
      phone: order.phone ?? "",
      address: order.address ?? "",
      city: order.city ?? "",
      state: order.state ?? "",
      order: order.id ?? "",
      postalCode: order.postalCode ?? "",
    },
    validationSchema: yup.object({
      phone: yup.string().required(),
      address: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      postalCode: yup.string().required(),
    }),
    onSubmit: async (values) => {
      setLoadingPaymentLink(true);
      try {
        const response = await axios.post(process.env.DJ_API_URL, {
          query: INITIATE_PAYMENT_MUTATION,
          variables: values,
        });

        if (response.data.data.featureInitiatePayment.success) {
          const paymentUrl = response.data.data.featureInitiatePayment.paymentLink;
          setPaymentLink(paymentUrl);
          setShowPopup(true);
          toast.success("Lien de paiement généré avec succès !");
        }
      } catch (error) {
        console.error("Erreur lors de la génération du lien :", error);
        toast.error("Une erreur est survenue lors de la génération du lien.");
      }
      setLoadingPaymentLink(false);
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success("Lien copié avec succès !");
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit}>
        <div className="space-y-6 p-4 md:p-6 lg:p-8">
          <div className="space-y-4">
            <Label htmlFor="email">E-mail address</Label>
            <Input type="email" name="email" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} />
            <ErrorMessage error={form.errors.email} touched={form.touched.email} />
          </div>

          <div className="space-y-4">
            <Label htmlFor="name">Name and surname</Label>
            <Input type="text" name="name" value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} />
            <ErrorMessage error={form.errors.name} touched={form.touched.name} />
          </div>

          <div className="space-y-4">
            <Label htmlFor="phone">Phone number</Label>
            <Input type="tel" name="phone" value={form.values.phone} onChange={form.handleChange} onBlur={form.handleBlur} />
            <ErrorMessage error={form.errors.phone} touched={form.touched.phone} />
          </div>

          <div className="space-y-4">
            <Label htmlFor="address">Address</Label>
            <Input type="text" name="address" value={form.values.address} onChange={form.handleChange} onBlur={form.handleBlur} />
            <ErrorMessage error={form.errors.address} touched={form.touched.address} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-4">
              <Label htmlFor="city">City</Label>
              <Input type="text" name="city" value={form.values.city} onChange={form.handleChange} onBlur={form.handleBlur} />
              <ErrorMessage error={form.errors.city} touched={form.touched.city} />
            </div>

            <div className="space-y-4">
              <Label htmlFor="state">State / Region</Label>
              <Input type="text" name="state" value={form.values.state} onChange={form.handleChange} onBlur={form.handleBlur} />
              <ErrorMessage error={form.errors.state} touched={form.touched.state} />
            </div>

            <div className="space-y-4">
              <Label htmlFor="postal">Postal code</Label>
              <Input type="text" name="postalCode" value={form.values.postalCode} onChange={form.handleChange} onBlur={form.handleBlur} />
              <ErrorMessage error={form.errors.postalCode} touched={form.touched.postalCode} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="billing" defaultChecked />
            <Label htmlFor="billing">The billing address is the same as the shipping address</Label>
          </div>
          {order.status != "WAITING_PAYMENT" && <p className="text-red-500">Already paid</p>}
          <Button
            disabled={loading || order.status !== "WAITING_PAYMENT"}
            loading={loading}
            className="w-full bg-[#6366F1] hover:bg-[#6366F1]/90"
            size="lg"
            onClick={() => router.push(paymentLink)}
          >
            Pay {order.totalAmount}
          </Button>

          <Button
            disabled={loading || order.status !== "WAITING_PAYMENT"}
            loading={loading}
            className="w-full bg-[#FFC300] hover:bg-[#FFC300]/90"
            size="lg"
            type="submit"
          >
            Générer un lien de paiement {order.totalAmount}
          </Button>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <p className="mb-4 text-lg font-semibold">Lien de paiement</p>
            <input
              type="text"
              value={paymentLink}
              readOnly
              className="w-full p-2 border rounded-md"
            />
            <div className="flex justify-between mt-4">
              <Button onClick={handleCopy} className="bg-blue-500 hover:bg-blue-700">
                Copier
              </Button>
              <Button onClick={() => setShowPopup(false)} className="bg-red-500 hover:bg-red-700">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
