import { db } from "@lib/db.mjs";
import { Room } from "@prisma/client";

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
