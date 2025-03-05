"use client";

import { deleteCartItem, getAOrder } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllCartThunk } from "@/redux/features/cartFeature";
import { AppDispatch, RootState } from "@/redux/store";
import { Lock, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AddressForm from "../AddressForm";
import { useCurrency } from "@/context/CurrencyContext";


export default function Component({ params }: { params: Promise<{ id: string , test: string }> }) {
  const [order, setOrder] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [fee, setFee] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();
  const [id, setId] = useState<string>("");
  const [res, setRes] = useState<any>(null);
  const exchangeRates: Record<string, number> = {
    XOF: 1,
    USD: 600,
    EUR: 655,
  };

  // (pour les prix de base en USD ou EURO, on va multiplier)
  const convertPrice = (priceXOF: number, targetCurrency: string) => {
    return (priceXOF / exchangeRates[targetCurrency]).toFixed(4);
  };
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await params;
        const result = await getAOrder(response.id);
        
        if (!result.success) {
          throw new Error("Failed to fetch order");
        }

        setId(response.id);
        setRes(result);
        setOrder(result.data);
        setCartItems(result.data.orderItems || []);

      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("An error occurred while fetching the order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Unable to load data.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="flex flex-col-reverse md:grid gap-8 md:grid-cols-[1fr,380px]">
          <AddressForm order={order} setFee={setFee} />

          <Card className="flex flex-col md:h-[calc(100vh)] shadow border-0 rounded-none bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 mb-4 border-b-2 pb-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      alt={item.artWork.title}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                      src={item.artWork.mediaUrls[0]}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold m-0">{item.artWork.title}</h3>
                    <p className="text-sm text-muted-foreground m-0">By {item.artWork.ownerName}</p>
                    <p className="text-sm"> {convertPrice(item.price, currency)} {currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{convertPrice(order.totalAmount, currency)} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping fees</span>
                <span>{convertPrice(fee, currency)} {currency}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{convertPrice(Number(order.totalAmount) + Number(fee), currency)} {currency}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
