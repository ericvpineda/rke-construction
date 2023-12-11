import ExifReader from "exifreader";
import fs from "fs";
import path from "path";
import { db } from "./db.mjs";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { Room } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINDARY_NAME,
  api_key: process.env.CLOUDINDARY_KEY,
  api_secret: process.env.CLOUDINDARY_SECRET,
});

const mapRoom = {
  bathroom: Room.BATHROOM,
  kitchen: Room.KITCHEN,
  balcony: Room.BALCONY,
  livingroom: Room.LIVING_ROOM,
  exterior: Room.EXTERIOR,
  dining: Room.DINING,
  hallway: Room.HALLWAY,
  floor: Room.FLOOR,
};

const constructionDir = process.cwd() + "/public/images/seed-construction";
const constructionTestDir =
  process.cwd() + "/public/images/seed-construction-test";

// Note: Make sure to manually clear cloudinary database prior
const clearDB = async () => await db.project.deleteMany({});

const uploadToCloud = async () => {
  console.log("DEBUG: Uploading to cloud...");
  clearDB();
  fs.readdir(constructionDir, (err, directory) => {
    if (!err) {
      // Iterate room types
      directory.forEach(async (roomName) => {
        const roomDir = path.join(constructionDir, roomName);
        fs.readdir(roomDir, async (err, files) => {
          if (!err) {
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
                        dateTaken: date ? new Date(date) : null,
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
          }
        });
      });
    }
  });
};

const uploadToLocal = async () => {
  console.log("DEBUG: Uploading to local database...");
  clearDB();
  fs.readdir(constructionTestDir, (err, directory) => {
    if (!err) {
      // Iterate room types
      directory.forEach(async (roomName) => {
        const roomDir = path.join(constructionTestDir, roomName);
        fs.readdir(roomDir, async (err, files) => {
          // Iterate images within room type
          for (let file of files) {
            // Create file path for image
            const filePath = path.join(roomDir, file);
            // Extract date from image EXIF
            const tags = await ExifReader.load(filePath);
            let date = null;
            if (tags && tags["DateTimeOriginal"]) {
              const imageDate = tags["DateTimeOriginal"].description;
              date =
                imageDate.slice(0, 10).replaceAll(":", "-") +
                "T" +
                imageDate.slice(11);
            }

            const imagePath = path
              .join("/images/seed-construction-test", roomName, file)
              .replaceAll("\\", "/"); // Note: Windows OS convert forward slash to back slash
            // Create db project instances using local filepath
            await db.project
              .create({
                data: {
                  name: file,
                  url: imagePath,
                  category: [mapRoom[roomName]],
                  dateTaken: date ? new Date(date) : null,
                },
              })
              .then(() => console.log(`SUCCESS: Uploaded local file: ${file}`))
              .catch(() =>
                console.log(`ERROR: ${file} unable to upload locally.`)
              );
          }
        });
      });
    }
  });
};

uploadToCloud();
// uploadToLocal();
