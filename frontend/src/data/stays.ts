import type { Service } from '../services/service.service';
export type Stay = {
  source?: Service; priceLabel?: string;
  id: string; name: string; type: string; area: string; image: string;
  price: number; rating: number; reviews: number; amenities: string[]; badge?: string;
};
// Illustration data adapted from the supplied UI reference, not live inventory.
export const stays: Stay[] = [
  { id:'woodlands', name:'Tetebatu Woodlands Homestay', type:'Homestay', area:'Tetebatu', image:'/images/generated/stay-v2.png', price:350000, rating:4.8, reviews:124, amenities:['wifi','parking','coffee'], badge:'choice' },
  { id:'sasak', name:'Sasak Village Villa', type:'Villa', area:'Tetebatu', image:'/images/generated/village-v2.png', price:600000, rating:4.7, reviews:98, amenities:['wifi','parking','pool'], badge:'popular' },
  { id:'green-rice', name:'Green Rice Homestay', type:'Homestay', area:'Tetebatu Selatan', image:'/images/generated/stay-v2.png', price:250000, rating:4.6, reviews:72, amenities:['wifi','parking','food'] },
  { id:'pondok', name:'Pondok Tepi Sawah', type:'Hotel', area:'Tetebatu', image:'/images/preview/stay.webp', price:300000, rating:4.7, reviews:60, amenities:['wifi','parking','coffee'] },
  { id:'lumbung', name:'Rumah Lumbung Tetebatu', type:'Guesthouse', area:'Tetebatu Selatan', image:'/images/generated/village-v2.png', price:200000, rating:4.5, reviews:45, amenities:['wifi','parking','food'] },
  { id:'breeze', name:'Tetebatu Breeze Resort', type:'Resort', area:'Tetebatu', image:'/images/preview/stay.webp', price:750000, rating:4.9, reviews:87, amenities:['wifi','parking','pool'] },
];
export const rupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
