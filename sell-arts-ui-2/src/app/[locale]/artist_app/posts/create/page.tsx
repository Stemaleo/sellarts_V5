"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPost } from "@/actions/posts";
import { toast } from "sonner";
import { useActions } from "@/lib/hooks";
import { useTranslations } from "next-intl";

export default function CreatePostForm() {
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();
  const { execute, loading } = useActions();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image || !content) {
      alert("Please select an image and add a content");
      return;
    }

    execute(createPost, { content }, image).then((res) => {
      if (res?.success) {
        toast.success("Posted...");
        router.back();
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("create-a-new-post")}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="image">{t("image")}</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
          {imagePreview && (
            <div className="mt-4">
              <Image src={imagePreview} alt="Preview" width={300} height={300} className="rounded-md object-cover" />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="content">{t("content")}</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="mt-1" placeholder="Write a content for your post..." />
        </div>
        <Button loading={loading} disabled={loading} type="submit">
          {t("create-a-new-post")}
        </Button>
      </form>
    </div>
  );
}
