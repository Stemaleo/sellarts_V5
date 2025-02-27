"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWork, ArtWorkDTO, ArtWorkWithRelated } from "@/lib/type";
import { GET_ARTWORK_BY_ID } from "./queries/artwork/querieArtwork";
import axios from "axios";

export const createArtWork = async (artWork: ArtWork, images: File[]) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(artWork));

  images.forEach((img) => {
    formData.append("images", img);
  });

  const res = await fetchHelper(process.env.API_URL + "/artists/artworks", {
    method: "post",
    body: formData,
    headers: {},
  });

  const data: ApiResponse<ArtWork> = await res.json();

  return data;
};

export const deleteArtWork = async (artworkId: string) => {
  const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}`, {
    method: "DELETE", // Méthode DELETE pour supprimer l'œuvre
  });

  const data: ApiResponse<any> = await res.json(); // On peut adapter le type de retour en fonction de ce que l'API retourne

  return data;
};

export const dJdeleteArtWork = async (artworkId: string) => {
  const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}`, {
    method: "DELETE", // Méthode DELETE pour supprimer l'œuvre
  });

  const data: ApiResponse<any> = await res.json(); // On peut adapter le type de retour en fonction de ce que l'API retourne

  return data;
};


export const updateArtWork = async (artworkId: string, artWork: ArtWork, images: File[]) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(artWork));

  // Ajouter les images si elles sont présentes
  images.forEach((img) => {
    formData.append("images", img);
  });

  const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}`, {
    method: "PUT",  // Utilisation de la méthode PUT pour la mise à jour
    body: formData, // Envoi des données avec les images dans le formData
    headers: {
      // Tu peux ajouter des headers si nécessaire, comme une autorisation
      // "Authorization": `Bearer ${token}`,
    },
  });

  const data: ApiResponse<ArtWork> = await res.json();  // Le type de retour est ApiResponse avec ArtWork

  return data;
};



export const getMyArtWorks = async (page: number, title: string, paintingType: string) => {
  const res = await fetchHelper(process.env.API_URL + `/artists/artworks?page=${page}&size=8&title=${title}&paintingType=${paintingType}`, {
    method: "GET",
  }
);


  

  const data: ApiResponse<PageableResponse<ArtWorkDTO>> = await res.json();

  return data;
};

export const getAllArtWorks = async (page: number, paintingType: string, materialType: string, price: number, title: string) => {
  const res = await fetchHelper(process.env.API_URL + `/public/artworks?page=${page}&size=8&paintingType=${paintingType}&materialType=${materialType}&price=${price}&title=${title}`, {
    method: "GET",
  });
  console.log('####################getAllArtWorks##########################');
  
console.log(getAllArtWorks);

  const data: ApiResponse<PageableResponse<ArtWorkDTO>> = await res.json();

  return data;
};
export const getAllFeaturedArtWorksOfAArtist = async (artistId: number) => {
  const res = await fetchHelper(process.env.API_URL + `/public/artworks/artist/${artistId}`, {
    method: "GET",
  });

  const data: ApiResponse<ArtWorkDTO[]> = await res.json();

  return data;
};

export const getArtWorkById = async (artworkId: string) => {
  const res = await fetchHelper(process.env.API_URL + `/public/artworks/${artworkId}`, {
    method: "GET",
  });

  const data: ApiResponse<ArtWorkWithRelated> = await res.json();

  return data;
};

export const fetchMethodAndStyle = async (artWorkID: string) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
      query: GET_ARTWORK_BY_ID,
      variables: {
        id: artWorkID,
      },
    });

    console.log("myresponse", res.data); // ✅ Affiche seulement les données JSON
    return res.data; // ✅ Retourne uniquement les données utiles
  } catch (err) {
    console.error("Error fetching method and style:", err);
    return null; // ✅ Retourne `null` en cas d'erreur au lieu d'un objet erreur
  }
};




export const updateFeaturedStatusOfArtWork = async (artworkId: string) => {
  const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}/featured`, {
    method: "PUT",
  });

  const data: ApiResponse<ArtWorkWithRelated> = await res.json();

  return data;
};
