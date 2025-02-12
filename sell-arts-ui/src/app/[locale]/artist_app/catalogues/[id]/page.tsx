import { getACatalog } from "@/actions/catalog";
import Image from "next/image";

interface CatalogPageProps {
  params: { id: string };
}

const CatalogPage = async ({ params }: CatalogPageProps) => {
  const { id } = params;
  const res = await getACatalog(id);

  if (!res.success) {
    return <div className="text-center text-red-500">Catalogue introuvable</div>;
  }

  const catalog = res.data;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{catalog.name}</h1>
      <p className="text-gray-500">{catalog.description}</p>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {catalog.artWorks.map((artwork) => (
          <div key={artwork.id} className="border rounded p-2">
            <Image
              src={artwork.mediaUrls[0]}
              alt={artwork.title}
              width={200}
              height={200}
              className="w-full h-auto rounded"
            />
            <h3 className="mt-2 font-semibold">{artwork.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
