"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArtWorkDTO, ArtWorkWithRelated, ArtWorkWithRelatedToArtWorkDTO } from "@/lib/type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useFormik } from "formik";
import ErrorMessage from "@/app/[locale]/ErrorMessage";
import * as yup from "yup";
import { toast } from "sonner";
import { updateArtWork, getArtWorkById } from "@/actions/artwork"; // Ajoute les actions d'édition
import { useActions } from "@/lib/hooks";
import { ArtWork, MaterialType, PaintingType } from "@/lib/type";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getAllMaterialTypes } from "@/actions/materialType";
import { useSearchParams } from "next/navigation";
import { calculateTotalFileSize } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function EditArtwork() {
  const t = useTranslations();
  const [images, setImages] = useState<File[]>([]);
  const params = useSearchParams();
  const { data, execute, loading } = useActions<ArtWork>();
  const { data: session } = useSession();
  const { data: paintingTypes, execute: fetchPaintingTypes, loading: paintingTypeLoading } = useActions<PaintingType[]>();
  const { data: materialTypes, execute: fetchMaterialTypes, loading: materialTypesLoading } = useActions<MaterialType[]>();

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
      size: artwork.size,
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

  const artworkId = params.get("artworkId"); // Déclarer artworkId

  useEffect(() => {
    if (artworkId) {
      getArtWorkById(artworkId).then((response) => {
        const artworkWithRelated = response?.data; // 'response' est de type ApiResponse<ArtWorkWithRelated>
        
        if (artworkWithRelated) {
          const artworkDTO = mapArtWorkWithRelatedToArtWorkDTO(artworkWithRelated);
          
          const formValues = mapArtWorkToFormValues(artworkDTO); 
          
          form.setValues(formValues);
        }
      });
    }
  
    fetchPaintingTypes(getAllPaintingTypes);
    fetchMaterialTypes(getAllMaterialTypes);
  }, []); // L'effet s'exécute une seule fois lors du montage du composant
  
  

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
      size: 0,
    },
    validationSchema: yup.object({
      title: yup.string().required().max(50),
      description: yup.string().required().min(50),
      paintingTypeId: yup.string().required("Type of painting is required"),
      materialTypeId: yup.string().required("Type of material is required"),
      width: yup.number().required(),
      height: yup.number().required(),
      price: yup.number().required(),
      size: yup.number().required(),
    }),
    async onSubmit(values, formikHelpers) {
      if (images.length == 0) {
        toast.error("Images are required to edit the artwork.");
        return;
      }
      try {
        const sizeInBytes = calculateTotalFileSize(images);
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
        if (sizeInBytes > maxSizeInBytes) {
          toast.error("File size exceeds 10MB limit.");
          return;
        }
        const res = await execute(updateArtWork, artworkId!, values, images);
        if (res?.success) {
          toast.success("Artwork updated successfully.");
          formikHelpers.resetForm();
          setImages([]);
        }
      } catch (e) {
        toast.error("Error updating artwork.");
      }
    },
  });

  return (
    <div className="container mx-auto">
      <Card className="shadow-none border-0 p-0 m-0">
        <CardHeader className="p-0 pb-8">
          <CardTitle className="text-2xl font-bold">{t("edit-artwork")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-8">
          <form className="space-y-6" onSubmit={form.handleSubmit}>
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
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                name="description"
                onChange={form.handleChange}
                value={form.values.description}
                onBlur={form.handleBlur}
                placeholder="Describe your artwork"
              />
              <ErrorMessage error={form.errors.description} touched={form.touched.description} />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label>{t("upload-images")}</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
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
                  />
                </label>
              </div>
              {images.length > 0 && (
                <div className="mt-4">
                  <ul className="flex gap-4">
                    {images.map((image, index) => (
                      <li key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`preview-${index}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <X
                          className="absolute top-0 right-0 text-red-600 cursor-pointer"
                          onClick={() => removeImage(index)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? t("loading") : t("update-artwork")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
