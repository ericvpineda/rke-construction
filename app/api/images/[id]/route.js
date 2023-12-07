import { db } from "@lib/db.mjs";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import ExifReader from "exifreader";
import { mapRoom } from "@lib/utils";
import { randomBytes } from "crypto";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const category = formData.get("category").toLowerCase();
    const prevUrl = formData.get("prevUrl");
    let images = [];
    let imageNames = [];
    let updatedImage = null;

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

          const hashedFileName = randomBytes(60).toString("hex")

          // Location to save new image
          const updateFilePath = join(
            process.cwd(),
            "public",
            "images",
            "seed-construction-test",
            hashedFileName
          );

          // Delete image from local folder command
          let deleteFilePath = join(process.cwd(), "public") + prevUrl;
          deleteFilePath = deleteFilePath.replaceAll("/", "\\");
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
          updatedImage = await db.project.update({
            data: {
              name: imageName,
              url: join(
                "/images",
                "seed-construction-test",
                hashedFileName
              ).replaceAll("\\", "/"),
              category: [mapRoom[category.replace("_", "")]],
              dateTaken: date ? new Date(date) : null,
            },
            where: {
              id: parseInt(id),
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
          results.push(updatedImage);
        }
      } else {
        const data = {
          category: [mapRoom[category.replace("_", "")]],
        };

        // Update database with new category only
        updatedImage = await db.project.update({
          data,
          where: {
            id: parseInt(id),
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

        results.push(updatedImage);
      }

      return new Response(JSON.stringify(updatedImage), {
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

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (process.env.NODE_ENV !== "production") {
      const folder = join(
        process.cwd(),
        "public",
        "images",
        "seed-construction-test"
      );

      // Check if test folder exists
      if (!existsSync(folder)) {
        return new Response(
          JSON.stringify("Error: seed-construction-test folder does not exist"),
          { status: 500 }
        );
      } else {
        // Update database with new category only
        const deletedImage = await db.project.delete({
          where: {
            id: parseInt(id),
          },
        });

        let deleteFilePath = join(process.cwd(), "public") + deletedImage.url;
        deleteFilePath = deleteFilePath.replaceAll("/", "\\");
        unlinkSync(deleteFilePath);
      }

      return new Response(JSON.stringify("Success, image deleted."), {
        status: 200,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
