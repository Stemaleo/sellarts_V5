"use client";

import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreateForm from "./createForm";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Paintbrush, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import DeleteButton from "./deleteButton";
import EditButton from "./editButton";
import { GET_ALL_STYLES } from "@/actions/queries/admin/style/getAllStyle";

// ✅ Ajout du type pour éviter l'erreur "never"
type StyleType = {
  node: {
    id: number;
    name: string;
  };
};

export default function StyleTypeManagement() {
  const [styles, setStyles] = useState<StyleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStyles = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_ALL_STYLES,
      });
      setStyles(response.data.data.styles.edges);
    } catch (err) {
      setError("Error loading methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <CreateForm onCreateSuccess={fetchStyles} />
      <Card>
        <CardHeader>
          <CardTitle>Methods Types Management</CardTitle>
          <CardDescription>Add, remove, and manage Methods Types for your art selling platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[150px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style) => (
                <TableRow key={style.node.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Paintbrush className="mr-2 h-4 w-4" />
                      {style.node.name}
                    </div>
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <EditButton styleId={style.node.id} styleName={style.node.name} onUpdate={fetchStyles} />
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
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the method type "{style.node.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DeleteButton styleId={style.node.id} onDeleteSuccess={fetchStyles} />
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
