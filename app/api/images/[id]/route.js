import { db } from "@lib/db.mjs";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import ExifReader from "exifreader";
import { mapRoom } from "@lib/utils";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const category = formData.get("category").toLowerCase();
    const prevImageName = formData.get("prevImageName");
    let images = [];
    let imageNames = [];
    let updatedUser = null;

    // Get image properties if images are present
    if (formData.has("images")) {
      images = formData.getAll("images");
      imageNames = formData.getAll("imageNames");
    }

    let results = [];
    if (process.env.NODE_ENV !== "production") {
      // Create category folder (if category updated)
      const folder = join(
        process.cwd(),
        "public",
        "images",
        "seed-construction-test"
      );

      // Create (updated) category folder if it doesn't exist
      if (!existsSync(folder)) {
        mkdirSync(folder);
      }

      if (images.length > 0) {
        // Update image file path and create new image resource if needed
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageName = imageNames[i];
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Location to save new image
          const updateFilePath = join(
            process.cwd(),
            "public",
            "images",
            "seed-construction-test",
            imageName
          );

          // Location to delete previous image
          const deleteFilePath = join(
            process.cwd(),
            "public",
            "images",
            "seed-construction-test",
            prevImageName
          );

          // Delete image from local folder command
          unlinkSync(deleteFilePath);

          // Write new image to folder command
          writeFileSync(updateFilePath, buffer);

          // Assign createdAt property if exists
          let date = null;
          const tags = await ExifReader.load(updateFilePath);
          if (tags && tags["DateTimeOriginal"]) {
            const imageDate = tags["DateTimeOriginal"].description;
            date =
              imageDate.slice(0, 10).replaceAll(":", "-") +
              "T" +
              imageDate.slice(11);
          }

          // Update database with new image/category
          updatedUser = await db.project.update({
            data: {
              name: imageName,
              url: join(
                "/images",
                "seed-construction-test",
                imageName
              ).replaceAll("\\", "/"),
              category: [mapRoom[category.replace("_", "")]],
              dateTaken: date ? new Date(date) : null,
            },
            where: {
              id: parseInt(id),
            },
          });
          results.push(updatedUser);
        }
      } else {
        const data = {
          category: [mapRoom[category.replace("_", "")]],
          url: join(
            "/images",
            "seed-construction-test",
            prevImageName
          ).replaceAll("\\", "/"),
        };

        // Update database with new category only
        updatedUser = await db.project.update({
          data,
          where: {
            id: parseInt(id),
          },
        });

        results.push(updatedUser);
      }

      return new Response(JSON.stringify(updatedUser), {
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
