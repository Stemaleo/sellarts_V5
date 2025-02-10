import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Post } from "@/lib/type";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

const PostCardManage = ({ post }: { post: Post }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Image alt="" className="aspect-square" src={post.mediaUrl} height={400} width={400} />
        <p className="mt-4">{post.content}</p>
      </CardContent>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>{post.likes} likes</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>{post.comments.length} comments</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-semibold">{comment.user.name}: </span>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCardManage;
