"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateProfileImage } from "@/actions/profile";
import { useSession } from "next-auth/react";
import { updateCoverImage } from "@/actions/artists";

interface ImageUploadProps {
  type: "cover" | "profile";
  initialImage: string;
  className?: string;
}

export function ImageUpload({ type, initialImage, className }: ImageUploadProps) {
  const [image, setImage] = useState(initialImage);
  const [isPending, startTransition] = useTransition();
  const { update, data: session } = useSession();

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        startTransition(async () => {
          const formData = new FormData();
          formData.append("file", file);
          if (type == "profile") {
            const result = await updateProfileImage(file);
            update({
              ...session,
              user: {
                ...session?.user,
                profileImageUrl: result.data,
              },
            });
            if (result.success) {
              console.log(result);
              setImage(result.data);
            }
          }

          if (type == "cover") {
            const result = await updateCoverImage(file);

            if (result.success) {
              console.log(result);
              setImage(result.data);
            }
          }
        });
      }
    };
    input.click();
  };

  return (
    <div className={`cursor-pointer ${className}`} onClick={handleImageClick}>
      <Image src={image} alt={`${type} image`} fill className="object-cover" />
      {isPending && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">Uploading...</div>}
    </div>
  );
}
