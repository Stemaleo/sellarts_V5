"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload } from "lucide-react";
import { updateProfileImage } from "@/actions/profile";
import { useActions } from "@/lib/hooks";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function ProfilePictureUploadComponent({ previewUrl, onUpdate }: { previewUrl?: string; onUpdate: Function }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { execute, loading } = useActions();
  const { update, data: session } = useSession();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const res = await execute(updateProfileImage, file);

    if (res?.success) {
      setMessage({ type: "success", text: "Profile picture uploaded successfully!" });
      toast.warning("Profile image updated");
      onUpdate(res.data);
    }
    setUploading(false);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <div {...getRootProps()} className="w-full cursor-pointer">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
            {preview ? (
              <Avatar className="w-32 h-32 object-cover">
                <AvatarImage src={preview} className="object-cover" alt="Profile picture preview" />
                <AvatarFallback>
                  <Camera className="w-8 h-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Camera className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-600 text-center mt-2">{isDragActive ? "Drop the image here" : "Drag 'n' drop an image here, or click to select"}</p>
          </div>
        </div>

        {file && (
          <Button onClick={uploadFile} disabled={uploading} className="w-full">
            {uploading ? (
              <span className="flex items-center">
                <Upload className="animate-bounce mr-2" />
                Uploading...
              </span>
            ) : (
              <span>Upload Profile Picture</span>
            )}
          </Button>
        )}

        {uploading && <Progress value={uploadProgress} className="w-full" />}

        {message && <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}
      </CardContent>
    </Card>
  );
}
