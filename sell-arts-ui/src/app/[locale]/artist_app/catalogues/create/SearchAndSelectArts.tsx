import { getMyArtWorks } from "@/actions/artwork";
import ArtCardManage from "@/components/ArtCardManage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PageableResponse } from "@/lib/api";
import { useActions } from "@/lib/hooks";
import { ArtWorkDTO } from "@/lib/type";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const SearchAndSelectArts = ({ selected, onSelect, onRemove }: { selected: ArtWorkDTO[]; onSelect: (art: ArtWorkDTO) => void; onRemove: (art: ArtWorkDTO) => void }) => {
  const { loading, execute } = useActions<PageableResponse<ArtWorkDTO>>();
  const [arts, setArts] = useState<ArtWorkDTO[]>([]);
  const [search, setSearch] = useState("");
  const t = useTranslations();
  const getArts = () => {
    execute(getMyArtWorks, 0, search, "").then((res) => {
      if (res?.success) {
        setArts([...res.data.content]);
      }
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    getArts();
  };

  useEffect(() => {
    getArts();
  }, []);

  return (
    <div>
      <div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div>
            <Button onClick={handleSearch}>{t("search")}</Button>
          </div>
        </div>
      </div>
      {loading ? (
        <ClipLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arts.map((artwork) => (
            <Card key={artwork.id}>
              <CardHeader className="aspect-square relative">
                <Image src={artwork.mediaUrls[0]} alt={artwork.title} className="w-full h-full" width={300} height={300} />
              </CardHeader>
              <CardContent className="grid grid-cols-[auto,20px]">
                <h3>{artwork.title}</h3>
                <Checkbox
                  defaultChecked={selected.findIndex((c) => c.id == artwork.id) != -1}
                  onCheckedChange={(c) => {
                    if (c) {
                      onSelect(artwork);
                    } else {
                      onRemove(artwork);
                    }
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndSelectArts;
