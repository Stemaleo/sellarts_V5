"use client"; // Déclare que ce composant est un Client Component

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getAllUsers } from "@/actions/auth";
import moment from "moment";
import Link from "next/link";
import TypeSelect from "./TypeSelect";
import { Switch } from "@/components/ui/switch";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { DELETE_BTN_USER_BY_ADMIN } from "@/actions/mutation/admin/deleteBtn/mutationDleteBtn";
import { GET_USERS_BY_ID } from "@/actions/queries/admin/querieUser";
import { SUSPENDRE_BTN_USER_BY_ADMIN } from "@/actions/mutation/admin/suspendreBtn/mutationSwitch";

export default function Component() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const userType = searchParams.get("type") || "all";

  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ status: boolean; id: number | null }>({ status: false, id: null });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers(currentPage, userType);
      if (res.success) {
        setUsers(res.data);
      }
    };
    fetchUsers();
  }, [currentPage, userType]);

  const deleteUser = async (userId: number) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: DELETE_BTN_USER_BY_ADMIN,
        variables: { users: [userId], delete: true },
      });
  
      if (response.data.data.featureUpdateUsersDeletion.success) {
        toast.success("Utilisateur supprimé avec succès");
  
        // Mise à jour sécurisée en s'assurant que `users.content` est bien un tableau
        setUsers((prevUsers: any) => ({
          ...prevUsers,
          content: prevUsers?.content?.filter((user: any) => user.id !== userId) || [],
        }));
        setShowDeleteConfirmation({ status: false, id: null })
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error("Erreur lors de la suppression :", error);
    }
  };
  
  const [userStatuses, setUserStatuses] = useState<{[key: number]: boolean}>({});

  const getUserById = async (userId: number) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_USERS_BY_ID,
        variables: { id: userId },
      });
      console.log("RESPONSE", response.data);

      if (response.data?.data?.users?.edges?.[0]?.node) {
        const isActive = Boolean(response.data.data.users.edges[0].node.isActive);
        console.log("ISACTIVE", isActive);
        setUserStatuses(prev => ({
          ...prev,
          [userId]: isActive
        }));
      }

    } catch (error) {
      toast.error("Erreur lors de la récupération du statut de l'utilisateur");
      console.error("Erreur lors de la récupération :", error);
    }
  };

  useEffect(() => {
    users.content?.forEach((user: any) => {
      getUserById(user.id);
    });
    console.log("USERSTATUS", userStatuses);
  }, [users.content]);


  const susBtnUserByAdmin = async (userId: number, status: boolean) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: SUSPENDRE_BTN_USER_BY_ADMIN,
        variables: { users: [userId], active: !status },
      });
  
      if (response.data) {
        console.log(response.data);   
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (!users || users.length === 0) {
    return <div>Impossible de charger les utilisateurs</div>;
  }
  

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
            <TypeSelect />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Suspendre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Inscrit depuis</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.content?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Switch
                        // defaultChecked={Boolean(getUserById(user.id))}
                        defaultChecked={Boolean()}
                        onCheckedChange={() => {
                          susBtnUserByAdmin(user.id, userStatuses[user.id]);
                        }}
                        className=""
                      />
                  </TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>{moment(user.registeredAt).format("D MMM Y")}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setShowDeleteConfirmation({ status: true, id: user.id })}
                      className="w-full md:w-auto mr-2"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Supprimer
                    </Button>
                    {user.type === "ARTIST" && (
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="outline">Voir Artiste</Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="w-full">
          <div className="flex justify-between items-center mt-4 w-full">
            <Button variant="outline" disabled={currentPage === 0} className="mx-2">
              <Link href={`/admin/users?page=${currentPage - 1}`} className="flex items-center">
                <ChevronLeftIcon className="h-4 w-4 mr-2" /> Précédent
              </Link>
            </Button>
            <span>Page {users.page?.number + 1} sur {users.page?.totalPages}</span>
            <Button variant="outline" disabled={currentPage >= users.page?.totalPages - 1} className="mx-2">
              <Link href={`/admin/users?page=${currentPage + 1}`} className="flex items-center">
                Suivant
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {showDeleteConfirmation.status && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
            <h3 className="text-lg font-semibold">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h3>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => deleteUser(showDeleteConfirmation.id!)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                {loading ? "Suppression..." : "Oui, Supprimer"}
              </button>
              <button
                onClick={() => setShowDeleteConfirmation({ status: false, id: null })}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop rtl={false} />
    </div>
  );
}
