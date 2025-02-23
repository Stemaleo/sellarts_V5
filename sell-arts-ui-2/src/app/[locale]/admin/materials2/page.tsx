"use client";

import * as React from "react";
import { useState } from "react";
import { Paintbrush, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type PaintingType = {
  id: string;
  name: string;
};

export default function PaintingTypesManagement() {
  const [paintingTypes, setPaintingTypes] = useState<PaintingType[]>([
    { id: "1", name: "Paper" },
    { id: "2", name: "Cloth" },
    { id: "3", name: "Glass" },
  ]);
  const [newTypeName, setNewTypeName] = useState("");

  const addPaintingType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim()) {
      const newType: PaintingType = {
        id: Date.now().toString(),
        name: newTypeName.trim(),
      };
      setPaintingTypes([...paintingTypes, newType]);
      setNewTypeName("");
    }
  };

  const removePaintingType = (id: string) => {
    setPaintingTypes(paintingTypes.filter((type) => type.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Material Management</CardTitle>
          <CardDescription>Add, remove, and manage painting material for your art selling platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPaintingType} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">New Painting Material</Label>
              <div className="flex space-x-2">
                <Input id="name" placeholder="Enter material name" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" /> Add Type
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Painting Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paintingTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Paintbrush className="mr-2 h-4 w-4" />
                      {type.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone. This will permanently delete the painting type "{type.name}" and remove it from our servers.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removePaintingType(type.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
