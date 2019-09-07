import Banner from "../domain/Banner";
import BannerRepository from "../domain/Boundaries";

export default class BannerInmemoryRepository implements BannerRepository {
    public banners = {
        Deals: [{
            imageUrl: "https://ae01.alicdn.com/kf/H5a6ac74b1a044657a606837cb18e157en.png",
            linkUrl: "https://www.awin1.com/cread.php?s=2374752&v=11640&q=337796&r=637907"
        }, {
            imageUrl: "https://ae01.alicdn.com/kf/H7866dd7e4b9f477eb27a1f2948c202dbw.png",
            linkUrl: "https://www.awin1.com/cread.php?s=2398177&v=11640&q=337171&r=637907"
        }, {
            imageUrl: "https://ae01.alicdn.com/kf/H655dde5f67c54346bffda41357ae23d7F.png",
            linkUrl: "https://www.awin1.com/cread.php?s=2169865&v=11640&q=337171&r=637907"
        }],
        Products: [{
            imageUrl: "https://images-eu.ssl-images-amazon.com/images/G/30/associates/maitri/banner/ES_title_count_44K_assoc_300x250.gif",
            linkUrl: "https://www.amazon.es/b?tag=toriishopping-21&linkCode=ur1&node=827231031"
        }, {
            imageUrl: "https://images-eu.ssl-images-amazon.com/images/G/30/ES-hq/2018/img/Consumer_Electronics/XCM_1103990_Manual_250x250_1103990_es_consumer_electronics_associates_electronic_store_associate_250x250_jpg_Associates_electronic_store.jpg",
            linkUrl: "https://www.amazon.es/b?tag=toriishopping-21&linkCode=ur1&node=599370031"
        }, {
            imageUrl: "https://images-eu.ssl-images-amazon.com/images/G/30/associates/22151220_ES_Associates_250x250._CB1198675309_.jpg",
            linkUrl: "https://www.amazon.es/dp/B079PFKDZC?tag=toriishopping-21&linkCode=ur1"
        }],
        Services: [{
            imageUrl: "https://images-eu.ssl-images-amazon.com/images/G/30/Primevideo/Associates/AssocAds_AVD-5164-International-Spain_250x250.jpg",
            linkUrl: "https://www.primevideo.com?tag=toriishopping-21"
        },
        {
            imageUrl: "https://images-eu.ssl-images-amazon.com/images/G/30/kindle/ku/associates/PD2019/XCM_Manual1177852_ES_KU_Ad_250x250_1561470311.png",
            linkUrl: "https://www.amazon.es/kindle-dbs/hz/signup?tag=toriishopping-21"
        }, {
            imageUrl: "https://images-eu.ssl-images-amazon.com//images/G/30/digital/music/2019/Associates/020819/ES_020819_EU_MC_Associates_02_250x250._CB454202434_.png",
            linkUrl: "https://www.amazon.es/gp/dmusic/promotions/AmazonMusicUnlimited?tag=toriishopping-21"
        }]
    };

    public get(): Promise<{ [key: string]: Banner[] }> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.banners);
            }, 250);
        });
    }
}
