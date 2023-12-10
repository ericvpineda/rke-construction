import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Room } from "@prisma/client";
 
export function classNames(...inputs) {
  return twMerge(clsx(inputs))
}

export const mapRoom = {
  bathroom: Room.BATHROOM,
  kitchen: Room.KITCHEN,
  balcony: Room.BALCONY,
  livingroom: Room.LIVING_ROOM,
  exterior: Room.EXTERIOR,
  dining: Room.DINING,
  hallway: Room.HALLWAY,
  floor: Room.FLOOR,
};


export const toBase64 = (file) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

