export const paintingTypes = ["OIL_PAINTING", "ACRYLIC_PAINTING", "WATERCOLOR_PAINTING", "DIGITAL_PAINTING", "OTHER_PAINTING"] as const;

export type PaintingType = (typeof paintingTypes)[number];

export const paintingTypeToText = (value: PaintingType) => {
  const paintingTypeMap: Record<PaintingType, string> = {
    OIL_PAINTING: "Oil Painting",
    ACRYLIC_PAINTING: "Acrylic Painting",
    WATERCOLOR_PAINTING: "Watercolor Painting",
    DIGITAL_PAINTING: "Digital Painting",
    OTHER_PAINTING: "Other Painting",
  };

  return paintingTypeMap[value];
};
