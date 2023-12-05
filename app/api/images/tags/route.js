import { db } from "@lib/db.mjs";
import { Room } from "@prisma/client";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";

const CATEGORIES = {
  bathroom: Room.BATHROOM,
  kitchen: Room.KITCHEN,
  balcony: Room.BALCONY,
  livingroom: Room.LIVING_ROOM,
  exterior: Room.EXTERIOR,
  dining: Room.DINING,
  hallway: Room.HALLWAY,
  floor: Room.FLOOR,
};

export async function GET(req) {
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit");
  const page = url.searchParams.get("page");
  const search = url.searchParams.get("search");

  try {
    const results = await db.project.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "asc",
      },
      where: {
        category: {
          has: CATEGORIES[search],
        },
      },
    });

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
    const category = formData.get("category");

    if (images.length === 0) {
      return new Response(
        JSON.stringify({ message: "No image(s) attached." }),
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageName = imageNames[i];
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const categoryFolder = join(
          process.cwd(),
          "public",
          "images",
          "seed-construction-test",
          category
        );

        if (!existsSync(categoryFolder)) {
          mkdirSync(categoryFolder);
        }

        const file = join(
          process.cwd(),
          "public",
          "images",
          "seed-construction-test",
          category,
          imageName
        );
        writeFileSync(file, buffer);
      }
      return new Response(JSON.stringify("Success, images uploaded locally."), {
        status: 201,
      });
    }

    return new Response(JSON.stringify("Success, images uploaded to cloud server."), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
