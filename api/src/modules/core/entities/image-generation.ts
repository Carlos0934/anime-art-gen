export enum ImageModels {
  AniImagineXL = "ani-imagine-xl",
}

export enum ImageQualities {
  Low = 1,
  Medium = 2,
  High = 3,
}

export class ImageGeneration {
  id: string;
  url: string;
  userId: string;
  metadata: ImageGenerationMetadata;
  createdAt: Date;
  constructor({
    userId,
    id,
    metadata,
    url,
    createdAt,
  }: {
    id: string;
    url: string;
    userId: string;
    metadata: ImageGenerationMetadata;
    createdAt: string | Date | number;
  }) {
    this.id = id;
    this.url = url;
    this.userId = userId;
    this.metadata = metadata;
    this.createdAt = new Date(createdAt);
  }
}
export enum ImageStyles {
  None = "none",
  Cinematic = "cinematic",
  Anime = "anime",
  Photographic = "photographic",
  Manga = "manga",
  DigitalArt = "digital-art",
  PixelArt = "pixel-art",
  FantasyArt = "fantasy-art",
  NeonPunk = "neon-punk",
}

export const modelQualityMap: {
  [key in ImageModels]: {
    [key in string]: ImageQualities;
  };
} = {
  [ImageModels.AniImagineXL]: {
    "(None)": ImageQualities.Medium,
    "Standard v3.1": ImageQualities.Medium,
    "Standard v3.0": ImageQualities.Medium,
    "Light v3.1": ImageQualities.Low,
    "Heavy v3.1": ImageQualities.High,
  },
};

export const modelStyleMap: {
  [key in ImageModels]: {
    [key in string]: ImageStyles;
  };
} = {
  [ImageModels.AniImagineXL]: {
    "(None)": ImageStyles.None,
    Cinematic: ImageStyles.Cinematic,
    Anime: ImageStyles.Anime,
    Photographic: ImageStyles.Photographic,
    Manga: ImageStyles.Manga,
    "Digital Art": ImageStyles.DigitalArt,
    "Pixel Art": ImageStyles.PixelArt,
    "Fantasy Art": ImageStyles.FantasyArt,
    "Neon Punk": ImageStyles.NeonPunk,
  },
};

export type ImageGenerationMetadata = {
  width: number;
  height: number;

  input: {
    prompt: string;
    negativePrompt?: string;
    strength: number;
    steps: number;
    seed: number;
    model: ImageModels;
    quality: ImageQualities;
    style?: string;
  };
};
