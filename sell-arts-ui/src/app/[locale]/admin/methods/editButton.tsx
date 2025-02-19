"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Paintbrush } from "lucide-react";
import axios from "axios";
import { EDIT_METHOD } from "@/actions/mutation/admin/methodsType/editMutation";

interface EditButtonProps {
  methodId: number;
  methodName: string;
  onUpdate: () => void;
}

export default function EditButton({ methodId, methodName, onUpdate }: EditButtonProps) {
  const [name, setName] = useState<string>(methodName);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false); 

  const handleEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: EDIT_METHOD,
        variables: { id: methodId, name },
      });
      onUpdate();
      setOpen(false);
    } catch (err) {
      setError("Failed to update method");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Paintbrush className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Method</AlertDialogTitle>
          <AlertDialogDescription>
            Modify the method type name below and save changes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new name" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <Button onClick={handleEdit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
