"use client";

import { addToFav } from "@/actions/fav";
import { Button } from "@/components/ui/button";
import { useActions } from "@/lib/hooks";
import { ArtWorkDTO } from "@/lib/type";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { Heart, SplineIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const AddToFav = ({ art }: { art: ArtWorkDTO }) => {
  const { status } = useSession();
  const router = useRouter();
  const path = usePathname();
  const { execute, loading } = useActions();
  const [isFav, setIsFav] = useState(art.fav);
  return (
    <div>
      <Button
        onClick={() => {
          if (status === "unauthenticated") {
            toast.error("You need to login");
            router.push("/login?callback=" + path);
            return;
          }
          execute(addToFav, art.id).then((res) => {
            if (res?.success) {
              if (res.data == "ADDED") {
                toast.success("Painting added to favourites");
                setIsFav(true);
              } else {
                setIsFav(false);
              }
            }
          });
        }}
        className="flex-1"
        disabled={loading}
        variant="outline"
      >
        {loading ? <ClipLoader size={20} color="black" /> : isFav ? <HeartFilledIcon className="h-4 w-4 text-red-500" /> : <Heart className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default AddToFav;
