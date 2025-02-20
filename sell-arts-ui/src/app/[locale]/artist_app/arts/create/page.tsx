"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useFormik } from "formik";
import ErrorMessage from "@/components/ErrorMessage";
import * as yup from "yup";
import { toast } from "sonner";
import { createArtWork } from "@/actions/artwork";
import { useActions } from "@/lib/hooks";
import { ArtWork, MaterialType, PaintingType, StyleType, MethodType } from "@/lib/type";
import { getAllPaintingTypes } from "@/actions/paintingType";
import { getAllMaterialTypes } from "@/actions/materialType";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { calculateTotalFileSize, hasRole } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { GET_ALL_METHODS } from "@/actions/queries/admin/methods/getAllMethod";
import axios from "axios";
import { GET_ALL_STYLES } from "@/actions/queries/admin/style/getAllStyle";
import { UPDATE_METHOD_STYLE } from "@/actions/mutation/artwork/mutationsArtwork";
export default function CreateArtwork() {
  const t = useTranslations();
  const [images, setImages] = useState<File[]>([]);
  const params = useSearchParams();
  const { data, execute, loading } = useActions<ArtWork>();
  const { data: session } = useSession();
  const { data: paintingTypes, execute: fetchPaintingTypes, loading: paintingTypeLoading } = useActions<PaintingType[]>();
  const { data: materialTypes, execute: fetchMaterialTypes, loading: materialTypesLoading } = useActions<MaterialType[]>();
  const [styles, setStyles] = useState<StyleType[]>([]);
  const [methods, setMethods] = useState<MethodType[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleMethodStyle = async ({idArtwork, styleId, methodId}: {idArtwork: string, styleId: string, methodId: string}) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_DJ_API_URL || "", {
        query: UPDATE_METHOD_STYLE,
        variables: {
          artwork: idArtwork,
          method: methodId, 
          style: styleId,
        },
      });

      const { data } = response;
      
      if (data.errors) {
        console.error("Erreur de suppression:", data.errors);
        return;
      }

      // Vérifiez si la suppression a été effectuée avec succès
      const success = data?.data?.featureUpdateArtworkMethodAndStyle?.success;
      
      // if (success) {
      //   onDeleteSuccess();
      // }
    } catch (error) {
      console.error("Erreur lors de l'appel à la mutation:", error);
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
  useEffect(() => {
    fetchPaintingTypes(getAllPaintingTypes);
    fetchMaterialTypes(getAllMaterialTypes);
    fetchMethods();
    fetchStyles();
  }, []);
 
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => file);
      // if (images.length + newImages.length > 3) {
      //   toast.error("Only 3 images are allowed");
      //   return;
      // }
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
      methodId: "",
      styleId: "",
      width: "",
      height: "",
      price: 0,
      size: 0,
      artistId: params.get("artistId"),
    },
    validationSchema: yup.object({
      id: yup.string(),
      title: yup.string().required().max(50),
      description: yup.string().required().min(50),
      paintingTypeId: yup.string().required("Type of painting is required"),
      materialTypeId: yup.string().required("Type of material is required"),
      methodId: yup.string().required("Type of method is required"),
      styleId: yup.string().required("Type of style is required"),
      width: yup.number().required(),
      height: yup.number().required(),
      price: yup.number().required(),
      size: yup.number().required(),
      artistId: yup.string().nullable(),
    }),
    async onSubmit(values, formikHelpers) {
      const {id,  methodId, styleId, ...restValues } = values;
      const filteredValues = restValues as ArtWork;
      //filteredValues<ArtwokSend>
      // console.log("zhdz");
      // console.log(values);
      // console.log("#################filteredValues#################");
      // console.log(filteredValues);
      // console.log("#################filteredValues#################");
      // console.log(methodId, styleId);
      

      if (images.length == 0) {
        toast.error("Images is required to create a art work.");
        return;
      }
      try {
        const sizeInBytes = calculateTotalFileSize(images);
        const maxSizeInBytes = 9 * 1024 * 1024; // 2MB limit
        console.log(maxSizeInBytes, sizeInBytes);

        if (sizeInBytes > maxSizeInBytes) {
          toast.error("File size exceeds 10MB limit.");
          return;
        }
        const res = await execute(createArtWork, filteredValues, images);
        if (res?.success) {
          handleMethodStyle({
            idArtwork: res.data.id,
            styleId: styleId,
            methodId: methodId,

          })
    
          toast.success("Created...");
          formikHelpers.resetForm();
          setImages([]);
        }
      } catch (e) {
        toast.error("sd");
      }
     },
  });

  return (
    <div className="container mx-auto ">
      {hasRole(session, "ROLE_GALLERY") && params.has("artistId") && (
        <div className="bg-yellow-100 p-4 mb-6 rounded-lg text-yellow-800">
          <h4>
            {t("creating-artwork-for")} {params.get("artistName")}
          </h4>
        </div>
      )}
      {hasRole(session, "ROLE_GALLERY") && !params.has("artistId") && (
        <div className="bg-red-100 p-4 mb-6 rounded-lg text-red-800">
          <h4>
            {t("want-to-create-artwork-for-an-artist")}{" "}
            <Link className="underline" href={"/artist_app/artists"}>
              {t("click-here")}
            </Link>
          </h4>
        </div>
      )}
      <Card className="shadow-none border-0 p-0 m-0">
        <CardHeader className="p-0 pb-8">
          <CardTitle className="text-2xl font-bold">{t("create-new-artwork")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-8">
          <form className="space-y-6" onSubmit={form.handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">{t("title")}</Label>
              <Input id="title" name="title" onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} placeholder="Enter artwork title" />
              <ErrorMessage error={form.errors.title} touched={form.touched.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea id="description" name="description" onChange={form.handleChange} value={form.values.description} onBlur={form.handleBlur} placeholder="Describe your artwork" />
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
                  {paintingTypes?.map((pt) => {
                    return (
                      <SelectItem value={pt.id.toString()} key={pt.id}>
                        {pt.name}
                      </SelectItem>
                    );
                  })}
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
                  {materialTypes?.map((pt) => {
                    return (
                      <SelectItem value={pt.id.toString()} key={pt.id}>
                        {pt.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <ErrorMessage error={form.errors.materialTypeId} touched={form.touched.materialTypeId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t("type-of-method")}</Label>
              <Select
                name="methodId"
                onValueChange={(val) => {
                  form.setFieldValue("methodId", val);
                }}
                value={form.values.methodId}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {methods?.map((pt) => {
                    return (
                      <SelectItem value={pt.id.toString()} key={pt.id}>
                        {pt.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <ErrorMessage error={form.errors.methodId} touched={form.touched.methodId} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t("type-of-style")}</Label>
              <Select
                name="styleId"
                onValueChange={(val) => {
                  form.setFieldValue("styleId", val);
                }}
                value={form.values.styleId}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {styles?.map((pt) => {
                    return (
                      <SelectItem value={pt.id.toString()} key={pt.id}>
                        {pt.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <ErrorMessage error={form.errors.styleId} touched={form.touched.styleId} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">{t("width-cm")}</Label>
                <Input id="width" name="width" onChange={form.handleChange} value={form.values.width} onBlur={form.handleBlur} type="number" placeholder="Width" />
                <ErrorMessage error={form.errors.width} touched={form.touched.width} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{t("height-cm")}</Label>
                <Input id="height" type="number" placeholder="Height" name="height" onChange={form.handleChange} value={form.values.height} onBlur={form.handleBlur} />
                <ErrorMessage error={form.errors.height} touched={form.touched.height} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t("artsPage.price")} (FCFA)</Label>
              <Input id="price" type="number" name="price" onChange={form.handleChange} value={form.values.price} onBlur={form.handleBlur} placeholder="Enter price" />
              <ErrorMessage error={form.errors.price} touched={form.touched.price} />
              <ErrorMessage error={form.errors.price} touched={form.touched.price} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">{t("artsPage.size")} (Kg)</Label>
              <Input id="size" type="number" name="size" onChange={form.handleChange} value={form.values.size} onBlur={form.handleBlur} placeholder="Enter size" />
              <ErrorMessage error={form.errors.size} touched={form.touched.size} />
              <ErrorMessage error={form.errors.size} touched={form.touched.size} />
            </div>
            {/* <input type="text" name="s" defaultValue={params.get("artistId") ?? ""} /> */}
            <div className="space-y-2">
              <Label>{t("upload-images")}</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">{t("click-to-upload")}</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
                </label>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Button disabled={loading} loading={loading} className="w-full mt-6 block">
                {t("create-new-artwork")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

function setStyles(edges: any) {
  throw new Error("Function not implemented.");
}

