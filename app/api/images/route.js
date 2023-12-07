import { db } from "@lib/db.mjs";

export async function GET(req) {
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit");
  const page = url.searchParams.get("page");
  let results;

  try {
    if (limit !== null && page !== null) {
      results = await db.project.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      results = await db.project.findMany({});
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
    const category = formData.get("category");

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

        const filePath = join(
          process.cwd(),
          "public",
          "images",
          "seed-construction-test",
          category,
          imageName
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
          url: join(
            "/images",
            "seed-construction-test",
            category,
            imageName
          ).replaceAll("\\", "/"),
          category: [mapRoom[category]],
          dateTaken: date ? new Date(date) : null,
        };

        await db.project.create({
          data,
        });
        results.push(data);
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
