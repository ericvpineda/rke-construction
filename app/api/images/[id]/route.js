import { db } from "@lib/db.mjs";
import { join } from "path";
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import ExifReader from "exifreader";
import { mapRoom, DEVELOPMENT } from "@lib/utils";
import { randomBytes } from "crypto";
import cloudinary from "@lib/cloudinaryConfig";

// -- Routes -- 

// PATCH image of given id
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
    if (process.env.NODE_ENV === DEVELOPMENT) {
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

// DELETE image of given id
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (process.env.NODE_ENV === DEVELOPMENT) {
      deleteLocal(id);
    } else {
      deleteCloud(id);
    }
    return new Response(JSON.stringify("Success, image deleted from database and file storage."), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

// -- Helper functions -- 

// Update image on local file storage
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

// Update image on cloud storage 
async function patchCloud({ category, images, imageNames, id }) {
  let updatedImage = null;

  // Update image(s) and/or category
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let imageName = imageNames[i];
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Destroy image on cloudinary
      await _deleteImageCloud(id);
      
      // Write new image to folder command
      const base64Data = Buffer.from(bytes).toString("base64");
      const ext = imageName.split(".").pop();
      const fileUri = "data:image/" + ext + ";" + "base64" + "," + base64Data;
    
      const cloudImage = await uploadStream(fileUri, category);
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

        updatedImage = await db.project.update({
          data: {
            name: imageName,
            url: cloudImage["secure_url"],
            category: [mapRoom[category]],
            dateTaken: date ? new Date(date) : null,
          },
          where: { id: parseInt(id) },
        });
      }
    }
  } else {
    // Update category ONLY

    // Get previous and updated public id
    const foundImage = await db.project.findUnique({
      where: { id: parseInt(id) },
    });
    const publicIdList = foundImage.url.split("/").slice(-2);
    const prevPublicId = publicIdList.join("/").split(".")[0];
    const updatedPublicId = category + "/" + publicIdList[1].split(".")[0];

    // Update/rename image path on cloud
    const cloudImage = await cloudinary.uploader.rename(
      prevPublicId,
      updatedPublicId
    );

    updatedImage = await db.project.update({
      data: {
        url: cloudImage["secure_url"],
        category: [mapRoom[category]],
      },
      where: { id: parseInt(id) },
    });
  }
  return updatedImage;
}

// Helper function for patchCloud to ONLY delete image on cloud server
async function _deleteImageCloud(id) {
  const foundImage = await db.project.findUnique({
    where: { id: parseInt(id) },
  });
  const publicUrl = foundImage.url.split("/").slice(-2).join("/");
  const path = publicUrl.split(".")[0];
  await cloudinary.uploader.destroy(path);
}

// Delete image from local file storage
async function deleteLocal(id) {
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
}

// Delete image on cloud storage 
async function deleteCloud(id) {
  const foundImage = await db.project.findUnique({
    where: { id: parseInt(id) },
  });

  // Destroy image on cloudinary
  const publicUrl = foundImage.url.split("/").slice(-2).join("/");
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

// Upload image to cloud storage and return result image
async function uploadStream(fileUri, category) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileUri,
      {
        folder: category,
        resource_type: "image",
      },
      (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      }
    );
  });
}

