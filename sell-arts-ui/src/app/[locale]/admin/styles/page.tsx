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
import { GET_ALL_METHODS } from "@/actions/queries/admin/methods/getAllMethod";
import EditButton from "./editButton";
import { GET_ALL_STYLES } from "@/actions/queries/admin/style/getAllStyle";


// ✅ Ajout du type pour éviter l'erreur "never"
type MethodType = {
  node: {
    id: number;
    name: string;
  };
};

export default function StyleTypeManagement() {
  const [styles, setStyle] = useState<MethodType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Déplacer fetchStyle en dehors du useEffect
  const fetchStyle = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_ALL_STYLES,
      });
      setStyle(response.data.data.styles.edges);
      console.log(response.data.data.styles.edges);
    } catch (err) {
      setError("Error loading methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyle();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <CreateForm />
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
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style, index) => {
                if (!style.node) {
                  return (
                    <TableRow key={index}>
                      <TableCell colSpan={2} className="text-center">
                        <p>Error: Missing node data</p>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={style.node.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Paintbrush className="mr-2 h-4 w-4" />
                        {style.node.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <EditButton styleId={style.node.id} styleName={style.node.name} onUpdate={fetchStyle} />
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
                            {/* <DeleteButton styleId={style.node.id} /> */}
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

