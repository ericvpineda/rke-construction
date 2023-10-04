import { db } from "@lib/db.mjs";

export async function GET(req) {
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit");
  const page = url.searchParams.get("page");

  try {
    const results = await db.project.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
  
    })
    return new Response(JSON.stringify(results), {status: 200});
  } catch (error) {
    return new Response("Could not fetch more images. Please try again later.", {status: 500});
  }
}
