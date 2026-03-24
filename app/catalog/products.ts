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
    slug: "dark-phantom-shadow-tee",
    title: "Dark Phantom Shadow Tee",
    color: "Ash Grey",
    price: 39,
    image: "/product_1.jpeg",
    description:
      "Signature oversized tee inspired by Dark Phantom visuals, built with a washed texture and clean front print.",
  },
  {
    id: 2,
    slug: "phantom-utility-wallet",
    title: "Phantom Utility Wallet",
    color: "Concrete Grey",
    price: 39,
    image: "/product_2.jpeg",
    description:
      "Minimal everyday wallet with a slim profile, clean stitching, and subtle Dark Phantom detailing.",
  },
  {
    id: 3,
    slug: "void-signal-backpack",
    title: "Void Signal Backpack",
    color: "Midnight Black",
    price: 78,
    image: "/product_3.jpeg",
    description:
      "Durable daypack with utility compartments and graphics influenced by the Dark Phantom channel aesthetic.",
  },
  {
    id: 4,
    slug: "night-raid-jacket",
    title: "Night Raid Jacket",
    color: "Smoke Grey",
    price: 39,
    image: "/product_4.jpeg",
    description:
      "Statement outerwear piece designed for a bold street silhouette with a subtle Dark Phantom edge.",
  },
];
