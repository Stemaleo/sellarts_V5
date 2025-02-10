import { getMyCatalogs } from "@/actions/catalog";
import { NativeSharePopup } from "@/components/native-share-popup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import DeleteCatalogButton from "./DeleteButton";
import { getTranslations } from "next-intl/server";

const CataloguesPage = () => {
  const res = use(getMyCatalogs());
  const t = use(getTranslations());

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center  mb-8">
        <h1 className="text-3xl font-bold">{t("my-catalogs")}</h1>
        <Link href={"/artist_app/catalogues/create"}>
          <Button>{t("create")}</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {res.data.map((cat) => {
          return (
            <Card key={cat.id}>
              <CardHeader>
                <CardTitle>{cat.name}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {cat.artWorks.map((s) => {
                    return <Image key={s.id + "img"} alt="" src={s.mediaUrls[0]} width={50} height={50} className="rounded aspect-square" />;
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-end">
                <DeleteCatalogButton catalogId={cat.id} />
                <div>
                  <NativeSharePopup useWindow={false} title={cat.name} url={"catalogs/" + cat.id} />
                </div>{" "}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CataloguesPage;
