import { db } from "@lib/db.mjs";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import ExifReader from "exifreader";
import { mapRoom } from "@lib/utils";
import { randomBytes } from "crypto";

export async function GET(req) {
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit");
  const page = url.searchParams.get("page");
  let results = null;

  try {
    if (limit !== null && page !== null) {
      results = await db.project.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "asc",
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
    } else {
      results = await db.project.findMany({
        orderBy: {
          createdAt: "asc",
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

    let results = [];
    if (process.env.NODE_ENV !== "production") {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let imageName = imageNames[i];
        const ext = "." + imageName.split('.').pop();
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

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

        const data = {
          name: imageName,
          url: join("/images", "seed-construction-test", hashedFileName).replaceAll(
            "\\",
            "/"
          ),
          category: [mapRoom[category]],
          dateTaken: date ? new Date(date) : null,
        };

        const newImage = await db.project.create({
          data,
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
      }
      return new Response(JSON.stringify(results), {
        status: 201,
      });
    }

    return new Response(
      JSON.stringify("Success, images uploaded to cloud server."),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
