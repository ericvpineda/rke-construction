import { db } from "@lib/db.mjs";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import ExifReader from "exifreader";
import { mapRoom } from "@lib/utils";
import { randomBytes } from "crypto";
import cloudinary from "@lib/cloudinaryConfig";

export async function GET(req) {
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit");
  const page = url.searchParams.get("page");
  let results = null;

  // TODO: Change back to createdAt desc
  try {
    if (limit !== null && page !== null) {
      results = await db.project.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: [
          {
            category: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          name: true,
          url: true,
          category: true,
          createdAt: true,
          dateTaken: true,
        },
      });
    } else {
      results = await db.project.findMany({
        orderBy: [
          {
            createdAt: "asc",
            util,
          },
        ],
        select: {
          id: true,
          name: true,
          url: true,
          category: true,
          createdAt: true,
          dateTaken: true,
        },
      });
    }

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const images = formData.getAll("images");
    const imageNames = formData.getAll("imageNames");
    const category = formData.get("category").toLowerCase().replace("_", "");

    if (images.length === 0) {
      return new Response(
        JSON.stringify({ message: "No image(s) attached." }),
        { status: 400 }
      );
    }

    const results = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let imageName = imageNames[i];
      const ext = "." + imageName.split(".").pop();
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (process.env.NODE_ENV === "TODO: Change back to development") {
        const folder = join(
          process.cwd(),
          "public",
          "images",
          "seed-construction-test"
        );

        if (!existsSync(folder)) {
          mkdirSync(folder);
        }

        const hashedFileName = randomBytes(60).toString("hex") + ext;

        const filePath = join(
          process.cwd(),
          "public",
          "images",
          "seed-construction-test",
          hashedFileName
        );

        writeFileSync(filePath, buffer);
        let date = null;
        const tags = await ExifReader.load(filePath);
        if (tags && tags["DateTimeOriginal"]) {
          const imageDate = tags["DateTimeOriginal"].description;
          date =
            imageDate.slice(0, 10).replaceAll(":", "-") +
            "T" +
            imageDate.slice(11);
        }

        const newImage = await db.project.create({
          data: {
            name: imageName,
            url: join(
              "/images",
              "seed-construction-test",
              hashedFileName
            ).replaceAll("\\", "/"),
            category: [mapRoom[category]],
            dateTaken: date ? new Date(date) : null,
          },
          select: {
            id: true,
            name: true,
            url: true,
            category: true,
            createdAt: true,
            dateTaken: true,
          },
        });

        results.push(newImage);
      } else {
        // Upload to production cloud storage

        // Get image information
        let date = null;
        const tags = await ExifReader.load(buffer);
        if (tags && tags["DateTimeOriginal"]) {
          const imageDate = tags["DateTimeOriginal"].description;
          date =
            imageDate.slice(0, 10).replaceAll(":", "-") +
            "T" +
            imageDate.slice(11);
        }

        // Upload to production cloud storage
        const cloudImage = await uploadStream(buffer, category);
        if (cloudImage) {
          const savedImage = await db.project.create({
            data: {
              name: imageName,
              url: cloudImage["secure_url"],
              category: [mapRoom[category]],
              dateTaken: date ? new Date(date) : null,
            },
          });
          results.push(savedImage);
        }
      }
    }
    return new Response(JSON.stringify(results), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

export async function uploadStream(buffer, category) {
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
