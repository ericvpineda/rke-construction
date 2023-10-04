import ExifReader from "exifreader";
import fs from "fs";
import path from "path";
import { db } from "./db.mjs";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { Room } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINDARY_NAME,
  api_key: process.env.CLOUDINDARY_KEY,
  api_secret: process.env.CLOUDINDARY_SECRET,
});

const mapRoom = {
  balcony: Room.BALCONY,
  bath: Room.BATHROOM,
  dining: Room.DINING,
  exterior: Room.EXTERIOR,
  floor: Room.FLOOR,
  hallway: Room.HALLWAY,
  living_room: Room.LIVING_ROOM,
  kitchen: Room.KITCHEN,
};
const constructionDir = process.cwd() + "/construction";

// Note: Make sure to manually clear cloudinary database prior
const clearDB = async () => await db.project.deleteMany({});

const uploadToCloud = async () => {
  fs.readdir(constructionDir, (err, directory) => {
    if (!err) {
      // Iterate room types
      directory.forEach(async (roomName) => {
        const roomDir = path.join(constructionDir, roomName);
        fs.readdir(roomDir, async (err, files) => {
          // Iterate images within room type
          for (let file of files) {
            // Create file path for image
            const filePath = path.join(roomDir, file);
            // Extract date from image EXIF
            const tags = await ExifReader.load(filePath);
            const imageDate = tags["DateTimeOriginal"].description;
            const date =
              imageDate.slice(0, 10).replaceAll(":", "-") +
              "T" +
              imageDate.slice(11);
            // Upload image to cloudinary
            await cloudinary.uploader
              .upload(filePath, { folder: roomName }, () => {})
              .then(async (data) => {
                await db.project
                  .create({
                    data: {
                      name: file,
                      url: data["secure_url"],
                      category: [mapRoom[roomName]],
                      createdAt: new Date(date),
                    },
                  })
                  .then(() =>
                    console.log(`SUCCESS: ${file} saved to database.`)
                  )
                  .catch((e) => console.log(e));
              })
              .catch(() =>
                console.log(`ERROR: ${file} upload to cloudinary failure.`)
              );
          }
        });
      });
    }
  });
};

// clearDB();
// uploadToCloud();
