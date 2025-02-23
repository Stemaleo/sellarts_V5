// "use client"
import * as React from "react";
 
import { Paintbrush, Plus, RssIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
 
 
import DeleteButton from "./deleteButton";
import { getAllBlogs, updateBlog } from "@/actions/blog";
import dynamic from "next/dynamic";
 
import BlogPreview from "./blogPreview";
import { Switch } from "@/components/ui/switch";
import UpdateButton from "./updateButton";
import CreateBlog from "./createBlog";
 

 

export default function BlogManagement() {

 

  const res = React.use(getAllBlogs());
  if (!res.success) {
    return <div>Failed to fetch</div>;
  }
  

  return (
  <div className="w-full grid  lg:grid-cols-4 md:grid-cols-4 gap-4 h-full ">
    <Card className="md:col-span-2 lg:col-span-2 col-span-3 ">
      <CardContent>
      <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Show</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
                <TableHead className="w-[100px]">Publish</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {res.data.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium w-full">
                    <div className="flex items-center">
                      <RssIcon className="mr-2 h-4 w-4" />
                      {type?.title}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                    <BlogPreview title="View" blog={type} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4" />
                        
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone. This will permanently delete the painting type "{type.title}" and remove it from our servers.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DeleteButton blogId={type.id!} />
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell className="font-medium w-full">
                    <UpdateButton data={type} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </CardContent>

    </Card>
    <CreateBlog/>
    
    
  </div>
  );
}
