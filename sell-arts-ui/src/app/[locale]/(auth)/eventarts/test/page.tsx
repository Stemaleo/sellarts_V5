import { getAllPaintingTypes } from "@/actions/paintingType";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { use } from "react";

const TestPage = async () => {
  const t = await getTranslations("artsPage");
  const res = await getAllPaintingTypes();

  return <div>{t("noArt")}</div>;
};

export default TestPage;
