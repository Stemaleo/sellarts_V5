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

export default function MethodeTypeManagement() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
          query: GET_ALL_METHODS,
        });
        setMethods(response.data.data.methods.edges);
        console.log(methods);


      } catch (err) {
        setError("Error loading methods");
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  console.log(methods);


  if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

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
              {methods.map((method, index) => {
                // Assurez-vous que `method.node` existe
                if (!method.node) {
                  return (
                    <TableRow key={index}>
                      <TableCell colSpan={2} className="text-center">
                        <p>Error: Missing node data</p>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={method.node.id}> {/* Utilisez method.node.id */}
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Paintbrush className="mr-2 h-4 w-4" />
                        {method.node.name} {/* Utilisez method.node.name */}
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
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the method type "{method.node.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <DeleteButton methodId={method.node.id} /> {/* Utilisez method.node.id */}
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
