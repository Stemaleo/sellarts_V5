"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {BlogType,  } from '@/lib/type';
import { title } from 'process';

type Props = {
  blog:BlogType
  title:string
}

const BlogPreview = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="button h-9 px-4 py-2 flex items-centers  rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"> {props?.title!} </DialogTrigger>
      <DialogContent className='h-[90vh] flex flex-col '>
        
        <DialogHeader>
          <DialogTitle>{props?.blog?.title!}</DialogTitle>
          {
            props?.blog?.createdAt &&
          <DialogDescription>
            {"Created At : "+props?.blog?.createdAt!}
          </DialogDescription>
          }
        </DialogHeader>
        <div className='overflow-y-auto' dangerouslySetInnerHTML={{ __html:  props?.blog?.content!}} />
      </DialogContent>

    </Dialog>
  );
};

export default BlogPreview;
