import { getAllColabOfAGallery } from "@/actions/colab";
import { PageProps } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

const Collaborators = async ({ params }: PageProps) => {
  const id = await params;
  const res = await getAllColabOfAGallery(id.id);
  const t = await getTranslations();
  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mt-12 mb-6">{t("common.collaborators")}</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {res.data.map((co) => {
          return (
            <Link href={"/artists/" + co.id} key={co.id}>
              <Image className="rounded-full" width={200} height={200} alt={co.userInfo?.name ?? ""} src={co.userInfo!.profileUrl} />
              <h3 className="text-center font-bold text-primary mt-2">{co.userInfo!.name}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Collaborators;
