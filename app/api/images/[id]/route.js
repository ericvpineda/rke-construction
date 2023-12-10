import { db } from "@lib/db.mjs";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import ExifReader from "exifreader";
import { mapRoom } from "@lib/utils";
import { randomBytes } from "crypto";
import cloudinary from "@lib/cloudinaryConfig";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const category = formData.get("category").toLowerCase().replace("_", "");
    const prevUrl = formData.get("prevUrl");
    let images = [];
    let imageNames = [];
    let updatedImage = null;

    // Get image properties if images are present
    if (formData.has("images")) {
      images = formData.getAll("images");
      imageNames = formData.getAll("imageNames");
    }

    // Patch images locally
    if (process.env.NODE_ENV === "production") {
      updatedImage = await patchLocal({
        category,
        prevUrl,
        images,
        imageNames,
        id,
      });
    } else {
      // Patch images on cloud
      updatedImage = await patchCloud({
        category,
        images,
        imageNames,
        id,
      });
    }

    return new Response(JSON.stringify(updatedImage), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

async function patchLocal({ category, prevUrl, images, imageNames, id }) {
  let updatedImage = null;

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
      let imageName = imageNames[i];
      const ext = "." + imageName.split(".").pop();
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const hashedFileName = randomBytes(60).toString("hex") + ext;

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
    }
  } else {
    // Update database with new category only
    updatedImage = await db.project.update({
      data: {
        category: [mapRoom[category.replace("_", "")]],
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
  }
  return updatedImage;
}

async function patchCloud({ category, images, imageNames, id }) {
  let updatedImage = null;

  // Update image resource and category (if need)
  if (images.length > 0) {
    // Update category only
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let imageName = imageNames[i];
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Delete image from cloud
      await deleteImageCloud(id);

      // Write new image to folder command
      const cloudImage = await uploadStream(buffer, category);
      if (cloudImage) {
        // Assign createdAt property if exists
        let date = null;
        const tags = await ExifReader.load(buffer);
        if (tags && tags["DateTimeOriginal"]) {
          const imageDate = tags["DateTimeOriginal"].description;
          date =
            imageDate.slice(0, 10).replaceAll(":", "-") +
            "T" +
            imageDate.slice(11);
        }

        updatedImage = await db.project.create({
          data: {
            name: imageName,
            url: cloudImage["secure_url"],
            category: [mapRoom[category]],
            dateTaken: date ? new Date(date) : null,
          },
        });
      }
    }
  } else {
    // Update database with new category only
    updatedImage = await db.project.update({
      data: {
        category: [mapRoom[category.replace("_", "")]],
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
  }

  return updatedImage;
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (process.env.NODE_ENV === "production") {
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

      return new Response(
        JSON.stringify("Success, image deleted from local."),
        {
          status: 200,
        }
      );
    } else {
      await deleteImageCloud(id);

      return new Response(
        JSON.stringify("Success, image deleted from cloud."),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

async function deleteImageCloud(id) {
  const foundImage = await db.project.findUnique({
    where: { id: parseInt(id) },
  });

  // Destroy image on cloudinary
  const publicUrl = foundImage.url.split("/").slice(-2).join("/")
  const path = publicUrl.split(".")[0];
  await cloudinary.uploader.destroy(path, async (error, _) => {
    if (!error) {
      // Delete image in database
      await db.project.delete({
        where: {
          id: parseInt(id),
        },
      });
    }
  });
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
