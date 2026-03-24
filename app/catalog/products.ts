export type Product = {
  id: number;
  slug: string;
  title: string;
  color: string;
  price: number;
  image: string;
  description: string;
};

export const defaultProducts: Product[] = [
  {
    id: 1,
    slug: "t-shirt-vlom-cust",
    title: "T-Shirt VLOM.CUST",
    color: "Vintage Grey",
    price: 39,
    image: "/product_1.jpeg",
    description:
      "Hand-finished oversized t-shirt with washed texture and signature custom graphics.",
  },
  {
    id: 2,
    slug: "cartholder-vlom-cust",
    title: "Cartholder VLOM.CUST",
    color: "Grey",
    price: 39,
    image: "/product_2.jpeg",
    description:
      "Compact everyday cardholder with minimal profile and custom brand detailing.",
  },
  {
    id: 3,
    slug: "calligraphy-backpack",
    title: "Calligraphy Backpack",
    color: "Black",
    price: 78,
    image: "/product_3.jpeg",
    description:
      "Urban backpack with hand-drawn calligraphy accents and utility-focused structure.",
  },
  {
    id: 4,
    slug: "leather-jacket-vlom-cust",
    title: "Leather Jacket VLOM.CUST",
    color: "Vintage Grey",
    price: 39,
    image: "/product_4.jpeg",
    description:
      "Statement leather jacket customized for a distressed, gallery-ready street silhouette.",
  },
];
