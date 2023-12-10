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

// Upload file stream with given category to cloud server
// Note: does not work with nextjs 
async function uploadBuffer(buffer, category) {
  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader
      .upload_stream(
        { resource_type: "image", folder: category },
        async (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      )
      .end(buffer);
  });
}