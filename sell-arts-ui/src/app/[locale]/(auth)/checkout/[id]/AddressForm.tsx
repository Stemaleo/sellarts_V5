import { updateOrderAddress } from "@/actions/cart";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActions } from "@/lib/hooks";
import { CountryType, Order } from "@/lib/type";
import { useFormik } from "formik";
import { Copy, Lock, MapPin, Search, X, AlertCircle, Check, ChevronsUpDown } from "lucide-react";
import axios from "axios";
import { INITIATE_PAYMENT_MUTATION } from "@/actions/mutation/artist/payement/mutationPayement";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as yup from "yup";
import { useEffect, useState, useRef } from "react";
import { GET_LOCATION } from "@/actions/queries/register/registerQuerie";
import { FEATURE_GENERATE_FEES } from "@/actions/mutation/artist/shipping/mutationShipping";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber, CountryCode, parsePhoneNumber, E164Number } from 'libphonenumber-js';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/ui/stepper";

interface Country {
  code: CountryCode;
  name: string;
  flag: string;
}

interface AddressFormProps {
  order: Order;
  setFee: any;
  currency?: string;  // Make it optional here
}

interface LocationResult {
  streetLine1: string;
  streetLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const PhoneNumberInput = ({ value, onChange, onBlur, error, touched }: any) => {
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const validatePhoneNumber = (phoneValue: string) => {
    if (!phoneValue) {
      setPhoneError("Phone number is required");
      return false;
    }
    
    try {
      if (!isValidPhoneNumber(phoneValue)) {
        setPhoneError("Invalid phone number format");
        return false;
      }
      
      setPhoneError(null);
      return true;
    } catch (error) {
      setPhoneError("Invalid phone number");
      return false;
    }
  };

  const handlePhoneChange = (phoneValue: E164Number | undefined) => {
    onChange(phoneValue);
    if (phoneValue) {
      validatePhoneNumber(phoneValue);
    } else {
      setPhoneError(null);
    }
  };

  const handlePhoneBlur = (e: any) => {
    onBlur(e);
    if (value) {
      validatePhoneNumber(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone number</Label>
      <div className="relative">
        <PhoneInput
          international
          defaultCountry="CI"
          value={value}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          className="w-full rounded-md border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 shadow-sm h-10"
          placeholder="+225 07 07 07 07 07"
          countrySelectProps={{
            className: "absolute left-0 top-0 h-full"
          }}
          numberInputProps={{
            className: "pl-16 w-full h-full rounded-md"
          }}
        />
        {value && isValidPhoneNumber(value) && !phoneError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {(phoneError || (error && touched)) && (
        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {phoneError || error}
        </p>
      )}
      <style jsx global>{`
        .PhoneInputInput {
          height: 38px;
          padding: 0 12px;
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
        }
        .PhoneInputCountry {
          margin-right: 8px;
          padding-left: 8px;
          display: flex;
          align-items: center;
        }
        .PhoneInput {
          display: flex;
          align-items: center;
          position: relative;
        }
        .PhoneInput--focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }
        .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 120px;
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        }
        .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          margin-right: 8px;
        }
        .PhoneInputCountrySelectArrow {
          margin-left: 4px;
          width: 8px;
          height: 8px;
          border-style: solid;
          border-color: currentColor transparent transparent;
          border-width: 4px 4px 0;
        }
      `}</style>
    </div>
  );
};

// Skeleton loader component for form fields
const FormFieldSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded w-full"></div>
  </div>
);

// Skeleton loader for the entire form
const AddressFormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
    
    <div className="grid gap-6 md:grid-cols-2">
      <FormFieldSkeleton />
      <FormFieldSkeleton />
    </div>
    
    <FormFieldSkeleton />
    <FormFieldSkeleton />
    <FormFieldSkeleton />
    
    <div className="grid gap-4 md:grid-cols-2 mt-8">
      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const steps = [
  {
    title: "Personal Information",
    description: "Enter your contact details"
  },
  {
    title: "Address",
    description: "Enter your shipping address"
  },
  {
    title: "Review & Payment",
    description: "Review your order and proceed to payment"
  }
];

const AddressForm = ({ order, setFee, currency }: AddressFormProps) => {
  const { execute, loading } = useActions();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loadingPaymentLink, setLoadingPaymentLink] = useState(false);
  const [pushPayment, setPushPayment] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addressIncomplete, setAddressIncomplete] = useState(false);
  const [validAddressSelected, setValidAddressSelected] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [calculatingFees, setCalculatingFees] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [feesCalculated, setFeesCalculated] = useState(false);
  const [shouldCalculateFees, setShouldCalculateFees] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [payAtStore, setPayAtStore] = useState(false);
  const [pickupInStore, setPickupInStore] = useState(false);

  const searchLocation = async (location: string) => {
    if (!location || location.length < 3) {
      setLocationResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    setAddressIncomplete(false);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_LOCATION,
        variables: { location },
      });

      if (response.data?.data?.searchLocations) {
        const results = response.data.data.searchLocations;
        setLocationResults(results);
        
        if (results.length === 0) {
          setAddressIncomplete(true);
          setValidAddressSelected(false);
          setFeesCalculated(false);
          checkFormValidity(false);
        }
      }
    } catch (err) {
      console.error("Error searching location:", err);
      setError("Error searching location");
      setValidAddressSelected(false);
      setFeesCalculated(false);
      checkFormValidity(false);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = (query: string) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 500); // 500ms delay
  };

  const checkFormValidity = (triggerFeeCalculation = true) => {
    const isEmailValid = validateEmail(form.values.email);
    const isNameValid = validateName(form.values.name);
    const isPhoneValid = form.values.phone && isValidPhoneNumber(form.values.phone);
    const isPostalCodeValid = !!form.values.postalCode;
    const isAddressValid = validAddressSelected;

    const isValid = isEmailValid && isNameValid && isPhoneValid && isPostalCodeValid && isAddressValid;
    
    setFormIsValid(isValid as boolean);
    
    if (!isValid) {
      let message = "Please complete all required fields: ";
      const missingFields = [];
      
      if (!isEmailValid) missingFields.push("email");
      if (!isNameValid) missingFields.push("name");
      if (!isPhoneValid) missingFields.push("phone number");
      if (!isPostalCodeValid) missingFields.push("postal code");
      if (!isAddressValid) missingFields.push("valid address");
      
      setValidationMessage(`Please complete all required fields: ${missingFields.join(", ")}`);
    } else {
      setValidationMessage(null);
    }
    
    return isValid;
  };

  const handleLocationSelect = (location: LocationResult) => {
    const fullAddress = location.streetLine1;
    setSelectedAddress(fullAddress);
    setSelectedLocation(location);
    setFeesCalculated(false);
    
    // Update form values directly
    form.setValues({
      ...form.values,
      address: fullAddress,
      city: location.city,
      state: location.state,
      postalCode: location.zip || form.values.postalCode, // Keep existing postal code if location.zip is empty
      allCountry: location.country
    });
    
    setShowResults(false);
    setAddressIncomplete(false);
    setValidAddressSelected(true);
    
    // Only trigger fee calculation when a location is selected
    if (order.id && !calculatingFees) {
      calculateShippingFees(order.id, location);
    }
  };

  const calculateShippingFees = async (orderId: string, location: LocationResult) => {
    // Double check that all fields are valid before proceeding
    if (!checkFormValidity(false)) {
      toast.warning(validationMessage || "Please complete all required fields before calculating shipping fees");
      return;
    }
    
    setCalculatingFees(true);
    
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: FEATURE_GENERATE_FEES,
        variables: { 
          order: orderId,
          country: location.country,
          address: location.streetLine1,
          city: location.city,
          state: location.state,
          postalCode: form.values.postalCode,
          email: form.values.email,
          zip: location.zip || form.values.postalCode,
          streetLine1: location.streetLine1,
          fullname: form.values.name,
          phoneNumber: form.values.phone
        },
      });
      
      if (response.data?.data?.featureGenerateFees?.order?.shippingFees) {
        const fees = response.data.data.featureGenerateFees.order.shippingFees;
        setShippingFee(fees);
        setFee(fees);
        setFeesCalculated(true);
        toast.success("Shipping fees calculated successfully");
      } else {
        toast.error("Could not calculate shipping fees");
        setFeesCalculated(false);
      }
    } catch (err) {
      console.error("Error calculating shipping fees:", err);
      setError("Failed to calculate shipping fees");
      toast.error("Failed to calculate shipping fees");
      setFeesCalculated(false);
    } finally {
      setCalculatingFees(false);
    }
  };

  const handleShipping = async (orderId: string, location: LocationResult) => {
    // Check form validity before proceeding
    if (!checkFormValidity(false)) {
      toast.warning(validationMessage || "Please complete all required fields");
      return;
    }
    
    setLoadingPaymentLink(true);
    try {
      console.log('2');
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: FEATURE_GENERATE_FEES,
        variables: { 
          order: orderId,
          country: location.country,
          address: location.streetLine1,
          city: location.city,
          state: location.state,
          postalCode: form.values.postalCode,
          email: form.values.email,
          zip: location.zip || form.values.postalCode, // Use form's postal code as fallback
          streetLine1: location.streetLine1,
          fullname: form.values.name,
          phoneNumber: form.values.phone
        },
      });
      
      console.log("######################LA REPONSE##############################");
      console.log(response.data.data);
      setFee(response.data.data?.featureGenerateFees?.order?.shippingFees);
      setFeesCalculated(true);
      setLoadingPaymentLink(false);
      console.log('4');
    } catch (err) {
      setError("Failed to update method");
      setFeesCalculated(false);
      setLoadingPaymentLink(false);
    }
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    
    setEmailError(null);
    return true;
  };

  const validateName = (name: string) => {
    if (!name) {
      setNameError("Name is required");
      return false;
    }
    
    if (name.length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    
    setNameError(null);
    return true;
  };

  const form = useFormik({
    initialValues: {
      email: order.owner?.email ?? "",
      name: order.owner?.name ?? "",
      phone: order.phone ?? "",
      allCountry:  "",
      currency: 'XOF', 
      address: order.address ?? "",
      city: order.city ?? "",
      state: order.state ?? "",
      billing: order.billing ?? "",
      order: order.id ?? "",
      postalCode: order.postalCode ?? "",
      pickupInStore: false,
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
      name: yup
        .string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      phone: yup
        .string()
        .required('Phone number is required')
        .test('isValidPhoneNumber', 'Invalid phone number', (value) => {
          if (!value) return false;
          return isValidPhoneNumber(value);
        }),
      address: yup.string().when('pickupInStore', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Address is required')
      }),
      allCountry: yup.string().when('pickupInStore', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Country is required')
      }),
      billing: yup.string(),
      city: yup.string().when('pickupInStore', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('City is required')
      }),
      state: yup.string().when('pickupInStore', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('State is required')
      }),
      postalCode: yup.string().when('pickupInStore', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Postal code is required')
      }),
    }),
    onSubmit: async (values) => {
      if (!checkFormValidity(false)) {
        toast.error(validationMessage || "Please complete all required fields");
        return;
      }
      
      if (!feesCalculated) {
        toast.warning("Please wait for shipping fees to be calculated");
        return;
      }
      
      // Use the selected location data for submission
      const submissionValues = {
        ...values,
        address: selectedLocation?.streetLine1 || values.address,
        city: selectedLocation?.city || values.city,
        state: selectedLocation?.state || values.state,
        postalCode: values.postalCode,
        allCountry: selectedLocation?.country || values.allCountry
      };
      
      console.log("##################");
      console.log(submissionValues);

      setLoadingPaymentLink(true);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
          query: INITIATE_PAYMENT_MUTATION,
          variables: submissionValues,
        });
        console.log("##################", submissionValues);
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
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Cleanup function to clear any pending timeouts when component unmounts
    return () => {
      clearTimeout(timer);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Check form validity whenever relevant fields change
  useEffect(() => {
    checkFormValidity(false); // Don't trigger fee calculation on field changes
  }, [
    form.values.email, 
    form.values.name, 
    form.values.phone, 
    form.values.postalCode, 
    validAddressSelected
  ]);

  // Update form values when pickupInStore changes
  useEffect(() => {
    form.setFieldValue('pickupInStore', pickupInStore);
  }, [pickupInStore]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success("Lien copié avec succès !");
  };

  const handleAddressInputFocus = () => {
    if (form.values.address && form.values.address.length >= 3 && form.values.address !== selectedAddress) {
      debouncedSearch(form.values.address);
      setShowResults(true);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail address</Label>
                <div className="relative">
                  <Input 
                    type="email" 
                    name="email" 
                    value={form.values.email} 
                    onChange={(e) => {
                      form.handleChange(e);
                      validateEmail(e.target.value);
                    }} 
                    onBlur={(e) => {
                      form.handleBlur(e);
                      validateEmail(e.target.value);
                    }}
                    className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="your@email.com"
                  />
                  {form.values.email && !form.errors.email && !emailError && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {(emailError || (form.errors.email && form.touched.email)) && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {emailError || form.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name and surname</Label>
                <div className="relative">
                  <Input 
                    type="text" 
                    name="name" 
                    value={form.values.name} 
                    onChange={(e) => {
                      form.handleChange(e);
                      validateName(e.target.value);
                    }} 
                    onBlur={(e) => {
                      form.handleBlur(e);
                      validateName(e.target.value);
                    }}
                    className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                  {form.values.name && !form.errors.name && !nameError && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {(nameError || (form.errors.name && form.touched.name)) && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {nameError || form.errors.name}
                  </p>
                )}
              </div>
            </div>

            <PhoneNumberInput
              value={form.values.phone}
              onChange={(value: string) => form.setFieldValue('phone', value)}
              onBlur={form.handleBlur}
              error={form.errors.phone}
              touched={form.touched.phone}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="payAtStore"
                  checked={payAtStore}
                  onCheckedChange={(checked) => {
                    setPayAtStore(checked as boolean);
                    if (checked) {
                      setPushPayment(false);
                    }
                  }}
                />
                <Label htmlFor="payAtStore" className="text-sm font-medium text-gray-700">
                  Je veux payer au point de vente
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pickupInStore"
                  checked={pickupInStore}
                  onCheckedChange={(checked) => {
                    setPickupInStore(checked as boolean);
                    if (checked) {
                      setValidAddressSelected(true);
                      setAddressIncomplete(false);
                      form.setFieldValue('postalCode', '00000');
                      form.setFieldValue('address', 'Pickup in store');
                      form.setFieldValue('city', 'Pickup in store');
                      form.setFieldValue('state', 'Pickup in store');
                      form.setFieldValue('allCountry', 'Pickup in store');
                    } else {
                      setValidAddressSelected(false);
                      form.setFieldValue('postalCode', '');
                      form.setFieldValue('address', '');
                      form.setFieldValue('city', '');
                      form.setFieldValue('state', '');
                      form.setFieldValue('allCountry', '');
                    }
                  }}
                />
                <Label htmlFor="pickupInStore" className="text-sm font-medium text-gray-700">
                  Je ne veux pas être livré (je viendrai chercher mon colis)
                </Label>
              </div>
            </div>

            {!pickupInStore && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">Postal code</Label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      name="postalCode" 
                      value={form.values.postalCode} 
                      onChange={form.handleChange} 
                      onBlur={form.handleBlur}
                      className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="12345"
                    />
                    {form.values.postalCode && !form.errors.postalCode && form.touched.postalCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage error={form.errors.postalCode} touched={form.touched.postalCode} />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" /> Address
                  </Label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      name="address" 
                      value={form.values.address} 
                      onChange={(e) => {
                        form.handleChange(e);
                        if (selectedAddress && e.target.value !== selectedAddress) {
                          setSelectedAddress("");
                          setAddressIncomplete(false);
                          setValidAddressSelected(false);
                          setSelectedLocation(null);
                          setFeesCalculated(false);
                        }
                        if (e.target.value.length >= 3) {
                          debouncedSearch(e.target.value);
                        }
                      }} 
                      onBlur={(e) => {
                        e.preventDefault();
                        setTimeout(() => {
                          if (!document.activeElement?.closest('.absolute')) {
                            if (validAddressSelected) {
                              setShowResults(false);
                            }
                          }
                        }, 200);
                      }}
                      onFocus={handleAddressInputFocus}
                      placeholder="Enter your address"
                      className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {validAddressSelected && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  <ErrorMessage error={form.errors.address} touched={form.touched.address} />
                  
                  {isSearching && (
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                      Searching...
                    </div>
                  )}
                  
                  {calculatingFees && (
                    <div className="text-sm text-indigo-500 flex items-center gap-2 mt-1">
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                      Calculating shipping fees...
                    </div>
                  )}
                  
                  {addressIncomplete && !isSearching && (
                    <div className="text-sm text-red-500 flex items-center gap-2 mt-1">
                      <X className="h-4 w-4" />
                      No address found. Please provide more details or try a different address format.
                    </div>
                  )}
                  
                  {!validAddressSelected && form.values.address && !isSearching && !addressIncomplete && (
                    <div className="text-sm text-amber-500 flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      Please select an address from the suggestions to continue.
                    </div>
                  )}
                  
                  {showResults && locationResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                      {locationResults.map((location, index) => (
                        <div 
                          key={index} 
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="font-medium">{location.streetLine1}</div>
                          <div className="text-sm text-gray-600">
                            {location.city}, {location.state} {location.zip}, {location.country}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{form.values.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{form.values.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{form.values.phone}</span>
                </div>
                {!pickupInStore && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{form.values.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Postal Code:</span>
                      <span className="font-medium">{form.values.postalCode}</span>
                    </div>
                  </>
                )}
                {pickupInStore && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Method:</span>
                    <span className="font-medium">Pickup in store</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {payAtStore ? "Pay at store" : "Online payment"}
                  </span>
                </div>
                {feesCalculated && !pickupInStore && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Shipping Fees:</span>
                    <span className="font-medium">{shippingFee} {currency}</span>
                  </div>
                )}
              </div>
            </div>

            {!formIsValid && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-700 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{validationMessage || "Please complete all required fields"}</p>
              </div>
            )}

            {order.status != "WAITING_PAYMENT" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <p className="font-medium">Already paid</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!validateEmail(form.values.email) || !validateName(form.values.name) || !form.values.phone) {
        return;
      }
    } else if (currentStep === 1) {
      if (!pickupInStore) {
        if (!validAddressSelected || !form.values.postalCode) {
          return;
        }
        
        // Calculate shipping fees only if delivery is selected
        try {
          setCalculatingFees(true);
          const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
            query: FEATURE_GENERATE_FEES,
            variables: { 
              order: order.id,
              country: form.values.allCountry,
              address: form.values.address,
              city: form.values.city,
              state: form.values.state,
              postalCode: form.values.postalCode,
              email: form.values.email,
              zip: form.values.postalCode,
              streetLine1: form.values.address,
              fullname: form.values.name,
              phoneNumber: form.values.phone
            },
          });
          
          if (response.data?.data?.featureGenerateFees?.order?.shippingFees) {
            const fees = response.data.data.featureGenerateFees.order.shippingFees;
            setShippingFee(fees);
            setFee(fees);
            setFeesCalculated(true);
            toast.success("Shipping fees calculated successfully");
          } else {
            toast.error("Could not calculate shipping fees");
            return;
          }
        } catch (err) {
          console.error("Error calculating shipping fees:", err);
          toast.error("Failed to calculate shipping fees");
          return;
        } finally {
          setCalculatingFees(false);
        }
      } else {
        // If pickup in store is selected, set fees to 0 and mark as calculated
        setShippingFee(0);
        setFee(0);
        setFeesCalculated(true);
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (isLoading) {
    return <AddressFormSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <form onSubmit={form.handleSubmit}>
        <div className="p-6">
          <Stepper steps={steps} currentStep={currentStep} className="mb-8" />
          
          <div className="space-y-6">
            {renderStepContent()}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            {currentStep === steps.length - 1 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {!payAtStore && (
                  <>
                    <Button
                      disabled={loadingPaymentLink || order.status !== "WAITING_PAYMENT" || !formIsValid}
                      loading={loadingPaymentLink}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-colors duration-200"
                      size="lg"
                      onClick={() => setPushPayment(true)}
                    >
                      Pay Now
                    </Button>
                    <Button
                      disabled={loadingPaymentLink || order.status !== "WAITING_PAYMENT" || !formIsValid}
                      loading={loadingPaymentLink}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-md transition-colors duration-200"
                      size="lg"
                      type="submit"
                    >
                      Generate Payment Link
                    </Button>
                  </>
                )}
                {payAtStore && (
                  <Button
                    disabled={loadingPaymentLink || order.status !== "WAITING_PAYMENT" || !formIsValid}
                    loading={loadingPaymentLink}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-colors duration-200"
                    size="lg"
                    type="submit"
                  >
                    Confirm Order
                  </Button>
                )}
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Link</h3>
            <div className="relative">
              <input
                type="text"
                value={paymentLink}
                readOnly
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
            </div>
            <div className="flex justify-between mt-6 gap-4">
              <Button 
                onClick={handleCopy} 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button 
                onClick={() => setShowPopup(false)} 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md transition-colors duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;