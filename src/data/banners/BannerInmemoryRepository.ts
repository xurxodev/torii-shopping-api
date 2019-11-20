import BannerRepository from "../../domain/banners/boundaries/BannerRepository";
import { BannerGroup, BannerGroupType } from "../../domain/banners/entities/Banner";

export default class BannerInmemoryRepository implements BannerRepository {
    private bannerGroups: BannerGroup[] = [
        {
            name: "Carousel",
            type: "Carousel",
            banners: [
                {
                    asin: "B07VGLKHWP",
                    imageUrl: "https://m.media-amazon.com/images/G/30/Phoenix/Fawkes/Quattro/1909/Associates-470X200.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07VGLKHWP?tag=toriishopping-21"
                },
                {
                    asin: "B07FQ4DJ83",
                    imageUrl: "https://m.media-amazon.com/images/G/30/kindle/merch/2019/campaign/89341241/xsite/jaeger-assoc-470x200.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07FQ4DJ83?tag=toriishopping-21"
                },
                {
                    asin: "B07PVCVBN7",
                    imageUrl: "https://m.media-amazon.com/images/G/30/kindle/merch/2019/campaign/53663101/xsite//tkms-es-associates-470x200.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07PVCVBN7?tag=toriishopping-21"
                },
                {
                    asin: "B07KD6624B",
                    imageUrl: "https://images-na.ssl-images-amazon.com/images/G/30/kindle/merch/2019/campaign/3811589/xsite/associate-desktop-470x200_v2.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07KD6624B?tag=toriishopping-21"
                }
            ]
        },
        {
            name: "Ofertas",
            type: "HorizontalList",
            banners: [
                {
                    asin: "B014X35XLU",
                    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81J49gLWqCL._SL1500_.jpg",
                    linkUrl: "https://www.amazon.es/Panasonic-LUMIX-H-H025-Objetivo-asf%C3%A9ricas/dp/B014X35XLU?psc=1&SubscriptionId=AKIAIBVJ6L7NGI65W7AA&tag=toriishopping-21&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B014X35XLU"
                },
                {
                    asin: "B006ZSNU4O",
                    imageUrl: "https://images-eu.ssl-images-amazon.com/images/I/41TVOFt1hWL.jpg",
                    linkUrl: "https://www.amazon.es/Fujifilm-Fujinon-XF-60mm-Distancia/dp/B006ZSNU4O?SubscriptionId=AKIAIBVJ6L7NGI65W7AA&tag=toriishopping-21&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B006ZSNU4O"
                },
                {
                    asin: "00A35X8ZG",
                    imageUrl: "https://images-eu.ssl-images-amazon.com/images/I/51FDyBrykSL.jpg",
                    linkUrl: "https://www.amazon.es/Sigma-340306-35-HSM-distancia/dp/B00A35X8ZG?psc=1&SubscriptionId=AKIAIBVJ6L7NGI65W7AA&tag=toriishopping-21&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B00A35X8ZG"
                },
                {
                    asin: "B07PQZR5JF",
                    imageUrl: "https://images-eu.ssl-images-amazon.com/images/I/41VyaPZLwpL.jpg",
                    linkUrl: "https://www.amazon.es/Samsung-2019-43RU7405-serie-RU7400/dp/B07PQZR5JF?psc=1&SubscriptionId=AKIAIBVJ6L7NGI65W7AA&tag=toriishopping-21&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B07PQZR5JF"
                }
            ]
        },
        {
            name: "Alexa",
            type: "HorizontalList",
            banners: [
                {
                    asin: "B07PFG54H7",
                    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81doBz4T%2BdL._SL1500_.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07PFG54H7?tag=toriishopping-21"
                }, {
                    asin: "B07PHPXHQS",
                    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/61oXLm%2BmGBL._SL1000_.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07PHPXHQS?tag=toriishopping-21"
                }, {
                    asin: "B07P64MGPP",
                    imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81oJhunDFNL._SL1500_.jpg",
                    linkUrl: "https://www.amazon.es/dp/B07P64MGPP?tag=toriishopping-21"
                }]
        }
    ];

    public get(): Promise<BannerGroup[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.bannerGroups);
            }, 250);
        });
    }
}
