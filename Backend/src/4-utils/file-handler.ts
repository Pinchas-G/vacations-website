import { UploadedFile } from "express-fileupload";
import { unlink } from "fs/promises";
import path from "path";
import { v4 as uuid } from 'uuid';

const imagesFolder = path.join(__dirname, '..', '1-assets', 'images');

export function getImagePath(imageName: string): string {
    return imagesFolder + '/' + imageName;
}

export async function saveImage(image: UploadedFile): Promise<string> {
    const ext = path.extname(image.name);
    const imageName = uuid() + ext;
    const absulutePath = getImagePath(imageName);

    await image.mv(absulutePath);
    return imageName;
}

export async function updateImage(image: UploadedFile, prevImageName: string): Promise<string> {
    await deleteImage(prevImageName);
    const imageName = await saveImage(image);
    return imageName;
}

export async function deleteImage(imageName: string): Promise<void> {
    try {
        if (!imageName) return;
        const absulutePath = getImagePath(imageName);
        await unlink(absulutePath);

    } catch (error: any) {
        console.log(error.message);
    }
}