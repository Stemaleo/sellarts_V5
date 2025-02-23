import { getACatalog } from "@/actions/catalog";
import ArtCard from "@/components/ArtCard";
import { PageProps } from "@/lib/api";
import { use } from "chai";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function CatalogPage(props: PageProps) {
  const params = await props.params;
  const res = await getACatalog(params.id);
  const t = await getTranslations();
  if (!res.success) {
    return <div>Unable to fetch</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        <Image src={res.data.owner?.coverUrl ?? "/"} className="h-72 w-full object-cover rounded-lg" alt={res.data.owner.userInfo?.name ?? ""} width={900} height={300} />
        <div className="absolute h-32 w-32">
          <Image src={res.data.owner.userInfo?.profileUrl ?? ""} alt={res.data.owner.userInfo?.name ?? ""} width={300} height={300} className="rounded-full border-2 absolute left-4 bottom-0 -translate-y-[50%] shadow-lg aspect-square object-cover" />
        </div>
      </div>

      {/* Artist/Gallery Details Section */}
      <section className="mb-12 mt-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">{res.data.owner.userInfo?.name}</h2>
            <p className="text-gray-600 mb-4">{res.data.owner?.location}</p>
            <p className="text-gray-800">{res.data.owner?.bio}</p>
          </div>
        </div>
      </section>

      {/* Artworks List Section */}
      {/* Title and Description */}
      <header className="mb-12">
        <h1 className="text-2xl font-bold mb-4">{res.data.name}</h1>
        <p className="text-xl text-gray-600">{res.data.description}</p>
      </header>
      <section>
        <h3 className="text-2xl font-semibold mb-6">{t("catalog")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {res.data.artWorks.map((artwork) => (
            <Link key={artwork.id} href={`arts/${artwork.id}`}>
              <ArtCard artwork={artwork} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
