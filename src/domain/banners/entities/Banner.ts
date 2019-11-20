export interface Banner {
    imageUrl: string;
    linkUrl: string;
    asin: string;
}

export interface BannerGroup {
    name: string;
    type: BannerGroupType;
    banners: Banner[];
}

export type BannerGroupType = "Carousel" | "HorizontalList" | "VerticalList";
