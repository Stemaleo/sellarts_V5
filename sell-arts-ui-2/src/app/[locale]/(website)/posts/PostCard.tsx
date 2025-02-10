"use client";
import { commentOnThePost, likeThePost } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActions } from "@/lib/hooks";
import { Comment, Post } from "@/lib/type";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { Heart, HeartIcon, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const PostCard = ({ post }: { post: Post }) => {
  const [comment, setComment] = useState("");
  const t = useTranslations();
  const { loading: postingComment, execute: postComment } = useActions<Comment>();
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() == "") {
      toast.warning("Comment can't be empty");
      return;
    }
    postComment(commentOnThePost, post.id, comment).then((res) => {
      if (res?.success) {
        toast.success("Comment posted...");
        post.comments.push(res.data);
        setComment("");
      }
    });
  };

  const { loading, execute } = useActions<number>();

  return (
    <Card>
      <CardContent className="p-4">
        <Image src={post.mediaUrl} alt={post.id.toString()} width={300} height={300} className="w-full h-auto rounded-md mb-4" />
        <p className="text-gray-700 mb-4">{post.content}</p>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => {
              execute(likeThePost, post.id).then((res) => {
                if (res?.success) {
                  post.likes = res.data;
                  post.liked = !post.liked;
                }
              });
            }}
            className="flex items-center"
          >
            {post.liked ? <HeartFilledIcon className="mr-2 text-primary h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
            {/* <span>{post.likes} likes</span> */}
            <span>
              {post.likes} {t("likes")}
            </span>
          </Button>
          <Button variant="ghost" className="flex items-center">
            <MessageCircle className="mr-2 h-4 w-4" />
            {/* <span>{post.comments.length} comments</span> */}
            <span>
              {post.comments.length} {t("comments")}
            </span>
          </Button>
        </div>
      </CardContent>
      {post.comments.length > 0 && (
        <CardContent className="pt-0">
          <h3 className="font-semibold mb-2">{t("comments")}</h3>
          <ul className="space-y-2">
            {post.comments.map((comment) => (
              <li key={comment.id} className="text-sm">
                <span className="font-semibold">{comment.user.name}: </span>
                <span className="text-gray-600">{comment.content}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
      <CardFooter>
        <form onSubmit={handleSubmitComment} className="w-full space-y-2">
          <div className="flex space-x-2">
            <Input type="text" onChange={(e) => setComment(e.target.value)} value={comment} placeholder="Add a comment..." className="flex-grow" />
          </div>
          <Button disabled={postingComment} loading={postingComment} type="submit" className="w-full">
            {t("post-comment")}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
