"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Palette, User } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "@/components/ErrorMessage";
import { useActions } from "@/lib/hooks";
import { register } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import axios from "axios";
import { GET_COUNTRY_REGISTER } from "@/actions/queries/register/registerQuerie";
import { CountryType } from "@/lib/type";
import { SEND_COUNTRY_ID } from "@/actions/mutation/register/registerMutation";

interface resData {

  id: number;
  // countries: CountryType[];

}
export default function Component() {
  const { execute, loading } = useActions();
  const t = useTranslations("register");
  const [country, setCountry] = useState<CountryType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCountry = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_COUNTRY_REGISTER,
      });

      
      if (response.data?.data?.country?.edges) {
        const countryList = response.data.data.country.edges.map((edge: any) => edge.node);
              console.log('La liste des pays');
      
      console.log(response.data.data.country);
        setCountry(countryList);
      }
      
    } catch (err) {
      setError("Error loading methods");
    } 
  };

  const handleUserIdAndCountry = async (useriD: number , countryId: string, values: any) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: SEND_COUNTRY_ID,
        variables: { user: useriD,
          country: countryId
         },
      }).then(async(response) =>  {
        console.log("##########################################");
        toast.success(t("loggingIn") + "...");
        console.log(response.data.data!?.featureUpdateUserCountry!?.user)
          const res = await signIn("credentials", {
          redirect: true,
          callbackUrl: values.type == "artist" || values.type == "gallery" ? "/artist_app/profile" : "/",
          ...values,

          // router.push("/login");
        });
      });

      console.log('4');
    } catch (err) {
      setError("Failed to update method");
    }
  };

  useEffect(()=> {  
    fetchCountry();
  }, []);

  const router = useRouter();
  const form = useFormik({
    initialValues: {
      name: "",
      email: "",
      country: "",
      password: "",
      confirmPassword: "",
      type: "customer",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Min 6 characters required").required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
      country: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      name: Yup.string().required("Required"),
      type: Yup.string().required("Required"),
    }),
    async onSubmit(values, formikHelpers) {
      const res = await execute(register, values);
      if (selectedType!=='customer') {
        if (res?.success) {
          const userId = (res?.data as resData).id
          handleUserIdAndCountry(userId , values.country, values);
 
       
      }
      if (!res?.success) {
        toast.error(res?.message);
        }
      }
    },
  });
  const userTypes = [
    { value: "customer", label: t("customer"), icon: User, description: t("i-want-to-browse-and-purchase-art") },
    { value: "artist", label: t("artist"), icon: Palette, description: t("i-want-to-showcase-and-sell-my-artwork") },
    { value: "gallery", label: t("gallery"), icon: Building2, description: t("i-represent-a-gallery-and-want-to-manage-exhibitions") },
  ];
  const [selectedType, setSelectedType] = useState<string | undefined>('customer');
  const [showFields, setShowFields] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-red-500">
      <Card className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-sm">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Image width={240} alt="logo" src={logo} />

          <CardTitle className="text-3xl font-bold">{t("createAccount")}</CardTitle>
          <CardDescription>{t("join-our-creative-community-today")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            {!showFields && (
              <div>
                <RadioGroup
                  value={form.values.type}
                  onValueChange={(val) => {
                    setSelectedType(val);
                    form.setFieldValue("type", val);
                  }}
                  className="grid gap-6 md:grid-cols-1"
                >
                  {userTypes.map((type) => (
                    <div key={type.value}>
                      <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                      <Label htmlFor={type.value} className="flex flex-col items-center justify-between rounded-md border-muted p-0 hover:text-accent-foreground border-2 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Card className="w-full bg-white/50">
                          <CardContent className="pt-6 grid grid-cols-[60px,auto] gap-4">
                            <type.icon className="w-12 h-12 mb-2 mx-auto" />
                            <div>
                              <h3 className="font-semibold">{type.label}</h3>
                              <p className="text-sm text-muted-foreground mt-2">{type.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    disabled={!selectedType}
                    onClick={() => {
                      setShowFields(true);
                    }}
                  >
                    Continue as {selectedType ? userTypes.find((t) => t.value === selectedType)?.label : ""}
                  </Button>
                </div>
              </div>
            )}
            {showFields && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("full-name")}</Label>
                  <Input id="name" name="name" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.name} placeholder="John Doe" />
                  <ErrorMessage error={form.errors.name} touched={form.touched.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" name="email" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.email} placeholder="m@example.com" required type="email" />
                  <ErrorMessage error={form.errors.email} touched={form.touched.email} />
                </div>
                {selectedType !== "customer" && (
                  <div className="space-y-2" >
                    <Label htmlFor="type">{t("select-country")}</Label>
                    <Select
                      name="country"
                      onValueChange={(val) => {
                        form.setFieldValue("country", val);
                      }}
                      value={form.values.country}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder={t("select-country")} />
                      </SelectTrigger>
                      <SelectContent>
                        {country?.map((pt) => {
                          return (
                            <SelectItem value={pt.id.toString()} key={pt.id}>
                              {pt.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <ErrorMessage error={form.errors.country} touched={form.touched.country} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input id="password" name="password" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.password} required type="password" />
                  <ErrorMessage error={form.errors.password} touched={form.touched.password} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirm-password")}</Label>
                  <Input id="confirmPassword" onChange={form.handleChange} onBlur={form.handleBlur} value={form.values.confirmPassword} name="confirmPassword" required type="password" />
                  <ErrorMessage error={form.errors.confirmPassword} touched={form.touched.confirmPassword} />
                </div>
                <Button loading={loading} disabled={!form.dirty || loading} className="w-full mt-4" id="submit" type="submit">
                  {t("sign-up")}
                </Button>
              </div>
            )}
          </form>
          <div className="mt-4 text-center text-sm">
            {t("already-have-an-account")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("sign-in")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

