export const categories = [
  "Fashion", "Beauty", "Electronics", "Mobiles", "Home", "Kitchen",
  "Appliances", "Furniture", "Grocery", "Health", "Sports", "Fitness",
  "Footwear", "Jewellery"
];

export const shops = [
  {
    name: "Urban Styles",
    tagline: "Minimal. Modern. You.",
    description: "Contemporary fashion for the modern minimalist.",
    rating: "4.9",
    reviews: "128",
    followers: "Sarah & 12 others",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85",
    avatar: "https://i.pravatar.cc/120?img=47"
  },
  {
    name: "Tech Haven",
    tagline: "Innovation First",
    description: "Latest gadgets and high-performance computing.",
    rating: "4.8",
    reviews: "96",
    followers: "Alex & 8 others",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=900&q=85",
    avatar: "https://i.pravatar.cc/120?img=12"
  },
  {
    name: "Glow & Grace",
    tagline: "Beauty that cares",
    description: "Curated beauty and wellness for every skin type.",
    rating: "4.7",
    reviews: "84",
    followers: "Priya & 21 others",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    avatar: "https://i.pravatar.cc/120?img=32"
  },
  {
    name: "Gadget Sphere",
    tagline: "Future Ready",
    description: "Smart electronics & home solutions.",
    rating: "4.6",
    reviews: "72",
    followers: "Rohan & 5 others",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
    avatar: "https://i.pravatar.cc/120?img=68"
  },
  {
    name: "Elite Fashion",
    tagline: "Designer Picks",
    description: "Handpicked designer collections & accessories.",
    rating: "5.0",
    reviews: "210",
    followers: "Maya & 34 others",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    avatar: "https://i.pravatar.cc/120?img=5"
  },
  {
    name: "Home Nest",
    tagline: "Live Beautifully",
    description: "Stylish furniture and home décor essentials.",
    rating: "4.8",
    reviews: "65",
    followers: "Arjun & 9 others",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    avatar: "https://i.pravatar.cc/120?img=11"
  }
];

export const products = [
  {
    name: "Men's Casual Shirt",
    price: "$999",
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Women's Dress",
    price: "$1,499",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Sports Sneakers",
    price: "$1,999",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Smart Watch",
    price: "$2,499",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Modern Sofa",
    price: "$8,999",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Premium Perfume",
    price: "$1,299",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=85"
  }
];

export const freeBuffDeals = [
  {
    id: "fb-1",
    title: "100% Free Unlimited Lunch Buffet Pass",
    shopName: "Campus Central Food Court",
    description: "Enjoy a complete 3-course lunch buffet. Includes rice, curry, fresh salads & ice cream.",
    originalPrice: "249",
    tag: "FREE BUFFET PASS",
    popular: true,
    claimed: 18,
    totalPasses: 20,
    validUntil: "Today, 3:30 PM",
    category: "Buffets",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "fb-2",
    title: "Free Chilled Cold Coffee & Sandwich",
    shopName: "The Brew & Bites Cafe",
    description: "Get a free thick hazelnut cold coffee paired with a fresh grilled cheese sandwich.",
    originalPrice: "149",
    tag: "FREE SNACK & DRINK",
    popular: true,
    claimed: 24,
    totalPasses: 25,
    validUntil: "Today, 6:00 PM",
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "fb-3",
    title: "Buy 1 Get 1 Free Loaded Pizza Buffet",
    shopName: "Slice & Dice Pizzeria",
    description: "Order any medium cheese overload pizza and get a second pizza + garlic bread 100% free.",
    originalPrice: "399",
    tag: "BOGO BUFFET DEAL",
    popular: false,
    claimed: 12,
    totalPasses: 15,
    validUntil: "Tomorrow, 9:00 PM",
    category: "Buffets",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "fb-4",
    title: "Free Campus Stationery Voucher",
    shopName: "Campus Print & Mart",
    description: "Redeem ₹100 worth of spiral notebooks, gel pens, and assignment printing for free.",
    originalPrice: "100",
    tag: "STUDENT VOUCHER",
    popular: false,
    claimed: 42,
    totalPasses: 50,
    validUntil: "31 Aug 2026",
    category: "Vouchers",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "fb-5",
    title: "Free Evening Snacks & Mocktail Pass",
    shopName: "Urban Campus Lounge",
    description: "Claim a complimentary plate of peri peri fries with a refreshing mint mojito mocktail.",
    originalPrice: "180",
    tag: "FREE EVENING PASS",
    popular: true,
    claimed: 19,
    totalPasses: 20,
    validUntil: "Today, 8:00 PM",
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "fb-6",
    title: "100% Free Dessert & Donut Box",
    shopName: "Sweet Cravings Bakery",
    description: "Box of 2 glazed chocolate donuts and brownie bites. Zero cost for registered students.",
    originalPrice: "120",
    tag: "FREE DESSERT PASS",
    popular: false,
    claimed: 28,
    totalPasses: 30,
    validUntil: "Tomorrow, 7:00 PM",
    category: "Buffets",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=85",
  },
];