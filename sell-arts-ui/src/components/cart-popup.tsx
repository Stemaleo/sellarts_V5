"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useActions } from "@/lib/hooks";
import { checkOutCart, deleteCartItem, getAllCart } from "@/actions/cart";
import { CartItem, Order } from "@/lib/type";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAllCartThunk } from "@/redux/features/cartFeature";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FEATEUR_GENERATE_FEES } from "@/actions/mutation/artist/shipping/mutationShipping";

export function CartPopupComponent() {
  const { execute, loading, data } = useActions<Order>();
  const { items: cartItems, addingStatus } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const [fee, setFee] = useState("");
  const { status } = useSession();


  
  const handleShipping = async (orderId: string) => {
    console.log('1');
    try {
      console.log('2');
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: FEATEUR_GENERATE_FEES,
        variables: { order: orderId, },
      });
      console.log('3');
      const res = response.data.data.featureGenerateFees; 
      setFee(response.data.data.featureGenerateFees.order.shippingFees);
      console.log('4');
    } catch (err) {
      setError("Failed to update method");
    }
  };
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(getAllCartThunk("s"));
    }
  }, [status]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItems?.length > 0 && <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{cartItems?.length}</span>}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          {cartItems?.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">Your cart is empty</p>
          ) : (
            <ul className="divide-y">
              {cartItems?.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image src={item.artwork?.mediaUrls[0]} alt={item.artwork.title} width={80} height={80} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium">
                        <h3>{item.artwork.title}</h3>
                        <p className="ml-4">FCFA {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">FCFA {item.price?.toFixed(2)} each</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteCartItem(item.id).then(() => {
                            toast.warning("Removed");
                            dispatch(getAllCartThunk("s"));
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <div className="mt-6 space-y-4">
          <Separator />
          <div className="flex justify-between text-base font-medium">
            <p>Subtotal</p>
            <p>FCFA {cartItems.reduce((p, e) => p + e.price * e.quantity, 0)}</p>
          </div>
          <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</p>
          <div className="mt-6">
            <Button
              className="w-full"
              onClick={() => {
                execute(checkOutCart).then((res) => {
                  dispatch(getAllCartThunk(""));
                  if (res?.success) {
                    // console.log(res.data.id);
                    handleShipping(res.data.id);
                    console.log('#######################');
                    console.log(fee);
                    
                    toast.info("Wait till you are redirected to payments page.");
                    router.push(`/checkout/${res.data.id}/${fee}`);

                  }
                });
              }}
              loading={loading}
              disabled={cartItems?.length === 0}
            >
              Checkout
            </Button>

          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-muted-foreground">
            <p>
              or{" "}
              <button type="button" className="font-medium text-primary hover:text-primary/80" onClick={() => setIsOpen(false)}>
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

