import c1 from "@public/images/products/kitchen/img1.jpg";
import c2 from "@public/images/products/kitchen/img2.jpg";
import c3 from "@public/images/products/kitchen/img3.jpg";
import b1 from "@public/images/products/bath/img1.jpg";
import b2 from "@public/images/products/bath/img2.jpg";
import b3 from "@public/images/products/bath/img3.jpg";
import b4 from "@public/images/products/bath/img4.jpg";
import b5 from "@public/images/products/bath/img5.jpg";
import b6 from "@public/images/products/bath/img6.jpg";
import d1 from "@public/images/products/dining/img1.jpg";
import d2 from "@public/images/products/dining/img2.jpg";
import d3 from "@public/images/products/dining/img3.jpg";
import d4 from "@public/images/products/dining/img4.jpg";
import d5 from "@public/images/products/dining/img5.jpg";
import e1 from "@public/images/products/exterior/img1.jpg";
import e2 from "@public/images/products/exterior/img2.jpg";
import e3 from "@public/images/products/exterior/img3.jpg";
import e4 from "@public/images/products/exterior/img4.jpg";

const products = [
  {
    name: "Remodeled Kitchen",
    scrollId: "kitchen",
    dataCompleted: "April 28, 2016",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: c1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: c2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: c3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
        // name: "Features",
        // items: [
        //   "Multiple strap configurations",
        //   "Spacious interior with top zip",
        //   "Leather handle and tabs",
        //   "Interior dividers",
        //   "Stainless strap loops",
        //   "Double stitched construction",
        //   "Water-resistant",
        // ],
      // },
    ],
  },
  {
    name: "Remodeled Bath",
    scrollId: "bath",
    dataCompleted: "January 1, 2010",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: b1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: b2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: b3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: b4,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 5,
        name: "Angled view",
        src: b5,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 6,
        name: "Angled view",
        src: b6,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
      //   name: "Features",
      //   items: [
      //     "Multiple strap configurations",
      //     "Spacious interior with top zip",
      //     "Leather handle and tabs",
      //     "Interior dividers",
      //     "Stainless strap loops",
      //     "Double stitched construction",
      //     "Water-resistant",
      //   ],
      // },
    ],
  },
  {
    name: "Remodeled Dining",
    scrollId: "dining",
    dataCompleted: "January 10, 2010",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: d1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: d2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: d3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: d4,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 5,
        name: "Angled view",
        src: d5,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
      //   name: "Features",
      //   items: [
      //     "Multiple strap configurations",
      //     "Spacious interior with top zip",
      //     "Leather handle and tabs",
      //     "Interior dividers",
      //     "Stainless strap loops",
      //     "Double stitched construction",
      //     "Water-resistant",
      //   ],
      // },
    ],
  },
  {
    name: "Remodeled Exterior",
    scrollId: "exterior",
    dataCompleted: "August 31, 2012",
    rating: 5,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: e1,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: e2,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: e3,
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: e4,
        alt: "Angled front view with bag zipped and handles upright.",
      },
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
  `,
    details: [
      // {
      //   name: "Features",
      //   items: [
      //     "Multiple strap configurations",
      //     "Spacious interior with top zip",
      //     "Leather handle and tabs",
      //     "Interior dividers",
      //     "Stainless strap loops",
      //     "Double stitched construction",
      //     "Water-resistant",
      //   ],
      // },
    ],
  },
];

export {products}