"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArtWorkDTO, ArtWorkWithRelated, ArtWorkWithRelatedToArtWorkDTO, StyleType, MethodType } from "@/lib/type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { useFormik } from "formik";
import ErrorMessage from "@/components/ErrorMessage";
import * as yup from "yup";
import { toast } from "sonner";
import { updateArtWork, getArtWorkById } from "@/actions/artwork";
import { useActions } from "@/lib/hooks";
import { ArtWork, MaterialType, PaintingType } from "@/lib/type";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getAllMaterialTypes } from "@/actions/materialType";
import { useParams } from "next/navigation";
import { calculateTotalFileSize } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { GET_ARTWORK_BY_ID } from "@/actions/queries/artwork/querieArtwork";
import axios from "axios";
import { GET_ALL_METHODS } from "@/actions/queries/admin/methods/getAllMethod";
import { GET_ALL_STYLES } from "@/actions/queries/admin/style/getAllStyle";
import { UPDATE_METHOD_STYLE } from "@/actions/mutation/artwork/mutationsArtwork";

export default function EditArtwork() {
  const router = useRouter();
  const params = useParams();
  const artworkId = params.id as string;

  if (!artworkId) {
    toast.error("Artwork ID is missing.");
    return null;
  }

  const t = useTranslations();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [styles, setStyles] = useState<StyleType[]>([]);
  const [methods, setMethods] = useState<MethodType[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data, execute, loading } = useActions<ArtWork>();
  const { data: session } = useSession();
  const { data: paintingTypes, execute: fetchPaintingTypes, loading: paintingTypeLoading } = useActions<PaintingType[]>();
  const { data: materialTypes, execute: fetchMaterialTypes, loading: materialTypesLoading } = useActions<MaterialType[]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mapArtWorkToFormValues = (artwork: ArtWorkDTO) => {
    return {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      paintingTypeId: artwork.paintingType.id.toString(),
      materialTypeId: artwork.materialType.id.toString(),
      width: artwork.width.toString(),
      height: artwork.height.toString(),
      price: artwork.price,
      size: artwork.size
    };
  };

  const mapArtWorkWithRelatedToArtWorkDTO = function (artworkWithRelated: ArtWorkWithRelated): ArtWorkWithRelatedToArtWorkDTO {
    return {
      id: artworkWithRelated.artwork.id,
      title: artworkWithRelated.artwork.title,
      description: artworkWithRelated.artwork.description,
      paintingType: artworkWithRelated.artwork.paintingType,
      materialType: artworkWithRelated.artwork.materialType,
      width: artworkWithRelated.artwork.width,
      height: artworkWithRelated.artwork.height,
      size: artworkWithRelated.artwork.size,
      price: artworkWithRelated.artwork.price,
      ownerName: artworkWithRelated.artwork.ownerName,
      mediaUrls: artworkWithRelated.artwork.mediaUrls,
      stock: artworkWithRelated.artwork.stock,
      inStock: artworkWithRelated.artwork.inStock,
      createdAt: artworkWithRelated.artwork.createdAt,
      fav: artworkWithRelated.artwork.fav,
      artistProfile: artworkWithRelated.artwork.artistProfile,
      credits: artworkWithRelated.artwork.credits,
      artistName: artworkWithRelated.artwork.artistName,
      featured: artworkWithRelated.artwork.featured
    };
  };

  // Récupération des styles
  const fetchStyles = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_ALL_STYLES,
      });

      if (response.data?.data?.styles?.edges) {
        const stylesList = response.data.data.styles.edges.map((edge: any) => edge.node);
        setStyles(stylesList);
      }
    } catch (err) {
      setError("Erreur lors du chargement des styles.");
    }
  };

  // Récupération des méthodes
  const fetchMethods = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: GET_ALL_METHODS,
      });

      if (response.data?.data?.methods?.edges) {
        const methodsList = response.data.data.methods.edges.map((edge: any) => edge.node);
        setMethods(methodsList);
      }
    } catch (err) {
      setError("Erreur lors du chargement des méthodes.");
    }
  };

  const handleMethodStyle = async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: UPDATE_METHOD_STYLE,
        variables: {
          artwork: artworkId,
          method: selectedMethodId,
          style: selectedStyleId,
        },
      });


      console.log(response, "response");
      const { data } = response;
      
      if (data.errors) {
        console.error("Erreur de mise à jour:", data.errors);
        return false;
      }

      const success = data?.data?.featureUpdateArtworkMethodAndStyle?.success;
      return success;
    } catch (error) {
      console.error("Erreur lors de l'appel à la mutation:", error);
      return false;
    }
  };

  const form = useFormik({
    initialValues: {
      id: "",
      title: "",
      description: "",
      paintingTypeId: "",
      materialTypeId: "",
      width: "",
      height: "",
      price: 0,
      size: 0
    },
    validationSchema: yup.object({
      title: yup.string().required().max(50),
      description: yup.string().required().min(50),
      paintingTypeId: yup.string().required("Type of painting is required"),
      materialTypeId: yup.string().required("Type of material is required"),
      width: yup.number().required(),
      height: yup.number().required(),
      price: yup.number().required(),
      size: yup.number().required()
    }),
    async onSubmit(values, formikHelpers) {
      if (images.length === 0 && existingImages.length === 0) {
        toast.error("Images are required to edit the artwork.");
        return;
      }
      try {
        setIsSubmitting(true);
        const sizeInBytes = calculateTotalFileSize(images);
        const maxSizeInBytes = 200 * 1024 * 1024; // 200MB limit
        if (sizeInBytes > maxSizeInBytes) {
          toast.error("File size exceeds 200MB limit.");
          setIsSubmitting(false);
          return;
        }

        // Prepare all images for update (existing URLs and new files)
        console.log(values, "values");
        console.log(images, "images");
        console.log(existingImages, "existingImages");
        
        const res = await updateArtWork(artworkId, values, images, existingImages);
        console.log(res, "res");
        
        // Update method and style if selected
        if (selectedMethodId && selectedStyleId) {
          const styleMethodSuccess = await handleMethodStyle();
          if (!styleMethodSuccess) {
            toast.error("Error updating style and method.");
          }
        }
        
        if (res?.success) {
          toast.success("Artwork updated successfully."); 
          formikHelpers.resetForm();
          setImages([]);
          router.push('/artist/arts');
        }
      } catch (e) {
        toast.error("Error updating artwork.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (artworkId) {
          // Fetch artwork details using GET_ARTWORK_BY_ID
          const response = await fetch(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: GET_ARTWORK_BY_ID,
              variables: { id: artworkId }
            }),
          });
          
          const data = await response.json();
          
          if (data.data?.artworks?.edges[0]?.node) {
            const artwork = data.data.artworks.edges[0].node;
            if (artwork.style) {
              setSelectedStyleId(artwork.style.id);
            }
            if (artwork.method) {
              setSelectedMethodId(artwork.method.id);
            }
          }
  
          const artworkResponse = await getArtWorkById(artworkId);
          const artworkWithRelated = artworkResponse?.data;
          
          if (artworkWithRelated) {
            const artworkDTO = mapArtWorkWithRelatedToArtWorkDTO(artworkWithRelated);
            const formValues = mapArtWorkToFormValues(artworkDTO); 
            form.setValues(formValues);
            
            // Set existing images
            if (artworkDTO.mediaUrls) {
              setExistingImages(artworkDTO.mediaUrls);
            }
          }
        }
      
        await Promise.all([
          fetchPaintingTypes(getAllPaintingTypes),
          fetchMaterialTypes(getAllMaterialTypes),
          fetchMethods(),
          fetchStyles()
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load artwork data");
        setIsLoading(false);
      } 
    };
    
    fetchData();
  }, [artworkId]); // Remove dependencies that cause infinite loop

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => file);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading artwork data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-md border rounded-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-center md:text-left">{t("edit-artwork")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("title")}</Label>
                <Input
                  id="title"
                  name="title"
                  onChange={form.handleChange}
                  value={form.values.title}
                  onBlur={form.handleBlur}
                  placeholder="Enter artwork title"
                />
                <ErrorMessage error={form.errors.title} touched={form.touched.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t("artsPage.price")} (FCFA)</Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  onChange={form.handleChange}
                  value={form.values.price}
                  onBlur={form.handleBlur}
                  placeholder="Enter price"
                />
                <ErrorMessage error={form.errors.price} touched={form.touched.price} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                name="description"
                onChange={form.handleChange}
                value={form.values.description}
                onBlur={form.handleBlur}
                placeholder="Describe your artwork"
                className="min-h-[120px]"
              />
              <ErrorMessage error={form.errors.description} touched={form.touched.description} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">{t("type-of-style")}</Label>
                <Select
                  value={selectedStyleId}
                  onValueChange={setSelectedStyleId}
                >
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles?.map((style) => (
                      <SelectItem value={style.id.toString()} key={style.id}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t("type-of-method")}</Label>
                <Select
                  value={selectedMethodId}
                  onValueChange={setSelectedMethodId}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {methods?.map((method) => (
                      <SelectItem value={method.id.toString()} key={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">{t("type-of-painting")}</Label>
                <Select
                  name="paintingTypeId"
                  onValueChange={(val) => {
                    form.setFieldValue("paintingTypeId", val);
                  }}
                  value={form.values.paintingTypeId}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {paintingTypes?.map((pt) => (
                      <SelectItem value={pt.id.toString()} key={pt.id}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage error={form.errors.paintingTypeId} touched={form.touched.paintingTypeId} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">{t("type-of-material")}</Label>
                <Select
                  name="materialTypeId"
                  onValueChange={(val) => {
                    form.setFieldValue("materialTypeId", val);
                  }}
                  value={form.values.materialTypeId}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes?.map((pt) => (
                      <SelectItem value={pt.id.toString()} key={pt.id}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage error={form.errors.materialTypeId} touched={form.touched.materialTypeId} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">{t("width-cm")}</Label>
                <Input
                  id="width"
                  name="width"
                  onChange={form.handleChange}
                  value={form.values.width}
                  onBlur={form.handleBlur}
                  type="number"
                  placeholder="Width"
                />
                <ErrorMessage error={form.errors.width} touched={form.touched.width} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{t("height-cm")}</Label>
                <Input
                  id="height"
                  name="height"
                  onChange={form.handleChange}
                  value={form.values.height}
                  onBlur={form.handleBlur}
                  type="number"
                  placeholder="Height"
                />
                <ErrorMessage error={form.errors.height} touched={form.touched.height} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">{t("artsPage.size")} (Kg)</Label>
                <Input
                  id="size"
                  type="number"
                  name="size"
                  onChange={form.handleChange}
                  value={form.values.size}
                  onBlur={form.handleBlur}
                  placeholder="Enter size"
                />
                <ErrorMessage error={form.errors.size} touched={form.touched.size} />
              </div>
            </div>

            <div className="space-y-4">
              <Label>{t("upload-images")}</Label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2 block">Current Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`existing-${index}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">{t("click-to-upload")}</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>

              {/* New Images Preview */}
              {images.length > 0 && (
                <div className="mt-4">
                  <Label className="mb-2 block">New Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-[120px]"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("updating")}
                  </>
                ) : (
                  t("update-artwork")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
