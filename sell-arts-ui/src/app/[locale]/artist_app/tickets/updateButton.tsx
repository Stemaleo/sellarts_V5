"use client";
 
import { deleteBlog, updateBlog } from "@/actions/blog";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { BlogType } from "@/lib/type";
 
import { useRouter } from "next/navigation";
import { useState } from "react";

const UpdateButton = ({ data }: { data: BlogType }) => {
  const [publish,setPublish]= useState<boolean | undefined>(data.publish);
  const handleChange = async () =>{
    const res = await updateBlog({
      id: data.id,
      title: data.title,
      content: data.content,
      publish: !data.publish, // Toggle the publish status
      author: data.author,
      duration: data.duration,
    });
      
      if (res.success) {
        router.refresh();
      }
    
    
  }
  const router = useRouter();
  return (
    <Switch
     checked={data.publish}
     onCheckedChange={handleChange}
    
    />
     
  );
};

export default UpdateButton;
