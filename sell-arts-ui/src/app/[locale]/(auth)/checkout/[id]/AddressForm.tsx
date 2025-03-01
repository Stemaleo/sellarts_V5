import { updateOrderAddress } from "@/actions/cart";
import ErrorMessage from "@/app/[locale]/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActions } from "@/lib/hooks";
import { CountryType, Order } from "@/lib/type";
import { useFormik } from "formik";
import { Lock } from "lucide-react";
import axios from "axios";
import { INITIATE_PAYMENT_MUTATION } from "@/actions/mutation/artist/payement/mutationPayement";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GET_ALL_COUNTRY } from "@/actions/queries/register/registerQuerie";
import { FEATEUR_GENERATE_FEES } from "@/actions/mutation/artist/shipping/mutationShipping";

interface Val{
  id: string
}
const AddressForm = ({ order, setFee}: { order: Order, setFee: any, }) => {
  const { execute, loading } = useActions();
  const router = useRouter();
  const [allCountry, setAllCountry] = useState<CountryType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingPaymentLink, setLoadingPaymentLink] = useState(false);
  const [pushPayment, setPushPayment] = useState(false);


  const fetchAllCountry = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_ALL_COUNTRY,
      });


      if (response.data?.data?.country?.edges) {
        const allCountryList = response.data.data.country.edges.map((edge: any) => edge.node);
        console.log('La liste des pays');

        console.log(response.data.data.country);
        setAllCountry(allCountryList);
      }

    } catch (err) {
      setError("Error loading methods");
    }
  };

  const handleShipping = async (orderId: string, countryId: string) => {
    setLoadingPaymentLink(true)
    try {
      console.log('2');
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: FEATEUR_GENERATE_FEES,
        variables: { order: orderId,
          country: countryId
         },
      }).then((response) => {
        console.log("######################LA REPONSE##############################");
        console.log(response.data.data)
         setFee(response.data.data!?.featureGenerateFees!?.order!?.shippingFees)
         setLoadingPaymentLink(false)
      });

      console.log('4');
    } catch (err) {
      setError("Failed to update method");
    }
  };
  const form = useFormik({
    initialValues: {
      email: order.owner?.email ?? "",
      name: order.owner?.name ?? "",
      phone: order.phone ?? "",
      allCountry:  "",
      address: order.address ?? "",
      city: order.city ?? "",
      state: order.state ?? "",
      billing: order.billing ?? "",
      order: order.id ?? "",
      postalCode: order.postalCode ?? "",
    },
    validationSchema: yup.object({
      phone: yup.string().required(),
      address: yup.string().required(),
      allCountry: yup.string().required(),
      billing: yup.string(),
      city: yup.string().required(),
      state: yup.string().required(),
      postalCode: yup.string().required(),
    }),
    onSubmit: async (values) => {
      console.log("##################");
      console.log(values);

      setLoadingPaymentLink(true);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
          query: INITIATE_PAYMENT_MUTATION,
          variables: values,
        });
        console.log("Response :", response);
        if (response.data.data.featureInitiatePayment.success) {
          const paymentUrl = response.data.data.featureInitiatePayment.paymentLink;
          if (pushPayment) {
            router.push(paymentUrl);
            toast.success("Redirecting to payment page...");
          } else {
            setPaymentLink(paymentUrl);
            setShowPopup(true);
            toast.success("Payment link generated successfully!");
          }
          
        }
      } catch (error) {
        console.error("Erreur lors de la génération du lien :", error);
        toast.error("Une erreur est survenue lors de la génération du lien.");
      }
      setLoadingPaymentLink(false);
    },
  });


  useEffect(() => {
    fetchAllCountry();
  }, []);

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

          <div className="space-y-2">
            <Label htmlFor="type">Pays</Label>
            <Select
              name="country"
              onValueChange={(val) => {
                form.setFieldValue("allCountry", val);
                handleShipping(order.id, val);
              }}
              value={form.values.allCountry}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {allCountry?.map((pt) => {
                  return (
                    <SelectItem value={pt.id.toString()} key={pt.id}>
                      {pt.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <ErrorMessage error={form.errors.allCountry} touched={form.touched.allCountry} />
          </div>
          {order.status != "WAITING_PAYMENT" && <p className="text-red-500">Already paid</p>}
          <Button
            disabled={loadingPaymentLink || order.status !== "WAITING_PAYMENT"}
            loading={loadingPaymentLink}
            className="w-full bg-[#6366F1] hover:bg-[#6366F1]/90"
            size="lg"
            onClick={() => setPushPayment(true)}
          >
            Pay
          </Button>

          <Button
            disabled={loadingPaymentLink || order.status !== "WAITING_PAYMENT"}
            loading={loadingPaymentLink}
            className="w-full bg-[#FFC300] hover:bg-[#FFC300]/90"
            size="lg"
            type="submit"
          >
            Générer un lien de paiement
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
