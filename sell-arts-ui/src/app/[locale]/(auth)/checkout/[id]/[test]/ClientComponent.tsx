"use client";

import { deleteCartItem, getAOrder } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddressForm from "../AddressForm";
import { useCurrency } from "@/context/CurrencyContext";

interface ClientProps {
  params: {
    id: string;
    test: string;
    locale: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ClientComponent({ params }: ClientProps) {
  const { id } = params;
  const [order, setOrder] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();

  const exchangeRates: Record<string, number> = {
    XOF: 1,
    USD: 700,
    EUR: 655,
  };

  const convertPrice = (priceXOF: number, targetCurrency: string) => {
    return (priceXOF / exchangeRates[targetCurrency]).toFixed(4);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getAOrder(id);
        if (!res.success) {
          throw new Error("Failed to fetch order");
        }
        setOrder(res.data);
        setCartItems(res.data.orderItems || []);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("An error occurred while fetching the order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Unable to load data.</div>;

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="flex flex-col-reverse md:grid gap-8 md:grid-cols-[1fr,380px]">
          <AddressForm order={order} setFee={setFee} />
          <Card className="flex flex-col md:h-[calc(100vh)] shadow border-0 rounded-none bg-slate-50">
            {/* ... rest of your JSX ... */}
          </Card>
        </div>
      </div>
    </div>
  );
} 