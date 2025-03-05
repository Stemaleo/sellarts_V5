"use client";

import { addToCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { ArtWorkDTO, CartItem } from "@/lib/type";
import { addToCartState, getAllCartThunk } from "@/redux/features/cartFeature";
import { AppDispatch } from "@/redux/store";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const AddToCartBtn = ({ art }: { art: ArtWorkDTO }) => {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  const path = usePathname();
  const { execute, loading } = useActions();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Button
      loading={loading}
      onClick={() => {
        if (status === "unauthenticated") {
          toast.error("You need to login");
          router.push("/login?callback=" + path);
          return;
        }
        execute(addToCart, art.id).then((res) => {
          if (res?.success) {
            toast.success("Painting added to cart");
            dispatch(getAllCartThunk("id"));
          }
        });
      }}
      className="w-full sm:w-auto flex-1 text-sm sm:text-base"
      disabled={loading}
    >
      <ShoppingCart className="mr-2 h-4 w-4" /> {t("cart.add-to-cart")}
    </Button>
  );
};

export default AddToCartBtn;
