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
import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AddressForm from "../AddressForm";

export default async function Component({ params }: { params: { id: string; orderType: string } }) {
  const { id, orderType } = params;
  console.log("Order ID:", id);
  console.log("Order Type:", orderType);
  const res = await getAOrder(id);
  // const initialValue = 12685
  // const feeStorage = window.localStorage.getItem(id);
  // const fees = feeStorage ? JSON.parse(feeStorage) : initialValue;


  if (!res.success) {
    return <div>Unable to load data.</div>;
  }
  const order = res.data;
  const cartItems = order.orderItems;

  return (
    <div className="min-h-screen">
      <div className="">
        <div className=" flex flex-col-reverse md:grid gap-8 md:grid-cols-[1fr,380px]">
          <AddressForm order={order} />

          <Card className="flex flex-col md:h-[calc(100vh)] shadow border-0 rounded-none bg-slate-50">
            <div className="flex-1 overflow-y-auto p-4">
              {/* Add more items here to demonstrate scrolling */}
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 mb-4 border-b-2 pb-2">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <Image alt="" className="w-full h-full object-cover" width={80} height={80} src={item.artWork.mediaUrls[0]} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold m-0">{item.artWork.title}</h3>
                    <p className="text-sm text-muted-foreground m-0">By, {item.artWork.ownerName}</p>
                    <p className="text-sm">{item.artWork.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{order.totalAmount} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping fees</span>
                <span>1000 FCFA</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{order.totalAmount} FCFA</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
