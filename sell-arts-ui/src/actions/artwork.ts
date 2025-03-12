"use server";

import { PageableResponse } from "@/lib/api";
import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, ArtWork, ArtWorkDTO, ArtWorkWithRelated } from "@/lib/type";
import { GET_ARTWORK_BY_ID } from "./queries/artwork/querieArtwork";
import axios from "axios";
import { UPDATE_ARTWORK_DELETIONS } from "./mutation/artwork/mutationsArtwork";

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

export const dJdeleteArtWork = async (artworkIds: [string]) => {
  const query = UPDATE_ARTWORK_DELETIONS;

  const variables = {
    artworks: artworkIds,
    isDeleted: true
  };

  const res = await fetchHelper(process.env.NEXT_PUBLIC_DJ_API_URL || "" , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await res.json();
  return data.data.featureUpdateArtworkDeletions;
};


// export const updateArtWork = async (artworkId: string, artWork: ArtWork, images: File[]) => {
//   const formData = new FormData();
//   formData.append("data", JSON.stringify(artWork));

//   // Ajouter les images si elles sont présentes
//   images.forEach((img) => {
//     formData.append("images", img);
//   });

//   const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}`, {
//     method: "PUT",  // Utilisation de la méthode PUT pour la mise à jour
//     body: formData, // Envoi des données avec les images dans le formData
//     headers: {
//       // Tu peux ajouter des headers si nécessaire, comme une autorisation
//       // "Authorization": `Bearer ${token}`,
//     },
//   });

//   const data: ApiResponse<ArtWork> = await res.json();  // Le type de retour est ApiResponse avec ArtWork

//   return data;
// };




export const updateArtWork = async (artworkId: string, artWork: ArtWork, existingImages: File[], newImages: string[]) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(artWork));

    // Ajouter les images existantes si elles sont présentes
    if (existingImages && existingImages.length > 0) {
      // Ensure each image has a valid name to prevent multipart parsing issues
      existingImages.forEach((img, index) => {
        // If the file has no name or size (like when created from URL string)
        // Create a new file with proper name and type
        if (!img.name || img.size === 0) {
          const newFile = new File([img], `image_${index}.jpg`, { type: 'image/jpeg' });
          formData.append("images", newFile);
        } else {
          formData.append("images", img);
        }
      });
    }

    if (newImages && newImages.length > 0) {
      // Add new images to the form data
      newImages.forEach((img) => {
        formData.append("images", img);
      });
    }

    // Get the authentication token from localStorage or cookies
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }

    const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}`, {
      method: "PUT",
      body: formData,
      headers: {
        // "Authorization": `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      return {
        success: false,
        message: "Authentication required. Please log in again.",
        data: null,
        errors: null
      };
    }

    const data: ApiResponse<ArtWork> = await res.json();
    console.log(data, "data");
    
    if (!data.success) {
      console.error("Update artwork failed:", data.message);
    }
    
    return data;
  } catch (error) {
    console.error("Error updating artwork:", error);
    return {
      success: false,
      message: "Error processing request",
      data: null,
      errors: null
    };
  }
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
    const res = await fetchHelper(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ARTWORK_BY_ID,
        variables: {
          id: artWorkID,
        },
      }),
    });

    const data = await res.json();
    console.log("myresponse", data);
    return data;
  } catch (error) {
    console.error("Error fetching method and style:", error);
    return { data: { artworks: { edges: [] } } };
  }
};




export const updateFeaturedStatusOfArtWork = async (artworkId: string) => {
  const res = await fetchHelper(process.env.API_URL + `/artists/artworks/${artworkId}/featured`, {
    method: "PUT",
  });

  const data: ApiResponse<ArtWorkWithRelated> = await res.json();

  return data;
};
