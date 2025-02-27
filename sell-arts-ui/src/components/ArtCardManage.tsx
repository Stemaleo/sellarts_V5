"use client";
import { ArtWorkDTO } from "@/lib/type";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NativeSharePopup } from "./native-share-popup";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useActions } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import Link from "next/link";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importer les styles pour Toast

import { updateFeaturedStatusOfArtWork, deleteArtWork } from "@/actions/artwork";

const ArtCardManage = ({ artwork, redirectUrl = "/artist_app/arts", useWindow = true }: { artwork: ArtWorkDTO; redirectUrl?: string; useWindow?: boolean }) => {
  const path = usePathname();
  const router = useRouter();
  const { execute } = useActions();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const handleDelete = async () => {
    setLoading(true);
    const res = await execute(deleteArtWork, artwork.id);
    setLoading(false);

    if (res?.success) {
      // Notification réussie (succès)
      toast.success("L'œuvre a été supprimée avec succès.");
      router.push(redirectUrl); // Redirection après la suppression
    } else {
      // Notification échouée
      toast.error("Échec de la suppression de l'œuvre.");
    }
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEdit = () => {
    router.push(`/artist_app/arts/edit-artwork/${artwork.id}`);
  };

  return (
    <>
      <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {artwork.inStock ? (
          <Badge className="absolute z-10 top-2 right-2 bg-green-500">In stock</Badge>
        ) : (
          <Badge className="absolute z-10 top-2 right-2 bg-red-500">Sold</Badge>
        )}
        <div className="relative h-48">
        <Link href={`/arts/${artwork.id}`}>
          <Image src={artwork.mediaUrls[0]} alt={artwork.title} layout="fill" objectFit="cover" />
        </Link>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 bg-primary/20 py-1 px-2 rounded-full inline h-auto">
              By, {artwork.ownerName}
            </span>
            <div className="">{<NativeSharePopup url={artwork.id} title={artwork.title} useWindow={useWindow} />}</div>
          </div>
          <h2 className="text-lg font-semibold mb-0 mt-1 line-clamp-1">{artwork.title}</h2>
          <p className="text-gray-500 mb-1 text-sm line-clamp-1">{artwork.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">FCFA {artwork.price}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{artwork.materialType.name}</Badge>
            <Badge variant="secondary">{artwork.paintingType.name}</Badge>
          </div>
          <div className="mt-4 flex gap-2 items-center">
            <Label>Featured?</Label>
            <Switch
              defaultChecked={artwork.featured}
              onCheckedChange={() => {
                execute(updateFeaturedStatusOfArtWork, artwork.id);
              }}
              className=""
            />
          </div>
          <div className="mt-4 flex gap-4">
            <Link href={`arts/edit-artwork/${artwork.id}`}>
              <Button className="w-full md:w-auto">
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </Button>
            </Link>
            <Button
              onClick={(event) => {
                event.stopPropagation(); 
                setShowDeleteConfirmation(true);
              }}
              className="w-full md:w-auto"
            >
              <Trash className="mr-2 h-4 w-4" /> Supprimer 
            </Button>

          </div>
        </div>

        {/* Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
              <h3 className="text-lg font-semibold">Êtes-vous sûr de vouloir supprimer cette œuvre ?</h3>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                >
                  {loading ? "Suppression..." : "Oui, Supprimer"}
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop rtl aria-label={undefined} />
      </div>
    </>
  );
};

export default ArtCardManage;
