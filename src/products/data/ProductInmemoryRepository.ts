import ProductRepository from "../domain/Boundaries";
import Product from "../domain/Product";

export default class ProductInmemoryRepository implements ProductRepository {
    public products = [
        {
            asin: "B07JBJSHLX",
            description: `Cámara inteligente – con Google Lens, Top Shot, grupo selfies y ilimitada de memoria Google Lens – el mundo cobren vida Batería inteligente – Carga rápido, mantiene durante mucho tiempo Google Assistant – en cualquier lugar para dich da Digital wellbeing – una vez no ser alcanzables`,
            ean: "",
            images: [
                "https://images-na.ssl-images-amazon.com/images/I/51czxBa-YoL._SL1144_.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/219k8LLJZpL.jpg"
            ],
            name: `Google Pixel 3 14 cm 4 GB 64 GB SIM única 4G Blanco 2915 mAh - Smartphone (14 cm , 4 GB, 64 GB, 12,2 MP, Android 9.0, Blanco)`,
            upc: "842776107695"
        },
        {
            asin: "B07HMGKC1T",
            description: `Resistencia al agua y al polvo IP67 (hasta 1 metro de profundidad durante un máximo de 30 minutos) Cámara de 12 Mpx con estabilización óptica de imagen y cámara frontal TrueDepth de 7 Mpx: modo Retrato, Iluminación de Retratos, Control de Profundidad y HDR Inteligente Face ID para autenticarse de forma segura y usar Apple Pay Chip A12 Bionic con Neural Engine de última generación Carga inalámbrica (funciona con cargadores Qi) iOS 12 con Memoji, Tiempo de Uso, Atajos de Siri y FaceTime de grupo`,
            ean: "",
            images: [
                "https://images-na.ssl-images-amazon.com/images/I/51PuFBgBK4L._SL1024_.jpg",
                "https://images-na.ssl-images-amazon.com/images/I/41p9ZCOyH6L._SL1024_.jpg"
            ],
            name: `Apple iPhone XR (de 64GB) - Blanco`,
            upc: "190198770844"
        }];

    public getByAsin(asin: string): Promise<Product> {
        const product = this.products.find((p) => p.asin === asin);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (product) {
                    resolve(product);
                } else {
                    reject(`Does not exist a product with asin ${asin}`);
                }
            }, 250);
        });
    }

    public get(filter: string): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.products);
            }, 250);
        });
    }
}
