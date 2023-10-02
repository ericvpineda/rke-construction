import ExifReader from 'exifreader';
import fs from "fs";
import path from "path";
import { db } from "./db.mjs";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { Room } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid'

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
  kitchen: Room.KITCHEN
}

const clearDB = async () => await db.project.deleteMany({});

const constructionDir = process.cwd() + "/construction";
const uploadToCloud = async () => {
  fs.readdir(constructionDir, (err, directory) => {
    if (!err) {
      // Iterate room types
      directory.forEach((roomName) => {
        const roomDir = path.join(constructionDir, roomName);
        fs.readdir(roomDir, async (err, files) => {
          // Iterate images within room type
          for (let file of files) {
            // Create file path for image
            const filePath = path.join(roomDir, file);
            // Extract date from image EXIF
            const tags = await ExifReader.load(
              filePath
            );
            const imageDate = tags["DateTimeOriginal"].description;
            const date =
              imageDate.slice(0, 10).replaceAll(":", "-") +
              "T" +
              imageDate.slice(11);
            // Upload image to cloudinary
            // await cloudinary.uploader.upload(
            //   filePath,
            //   { folder: roomName },
              async (error, result) => {
                await db.project.create({
                  data: {
                    name: file,
                    url: uuidv4(),
                    category: [mapRoom[roomName]],
                    createdAt: new Date(date),
                  },
                }).catch(e => console.log(e));
              }
            // );
            console.log("DEBUG: completed ", file)
          }
        });
      });
    }
  });
};

// clearDB();
uploadToCloud();