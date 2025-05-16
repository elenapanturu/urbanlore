import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export async function fetchImageUrl(query) {
    const apiKey = process.env.PIXABAY_API_KEY;
    const res = await fetch(
        `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
            query
        )}&image_type=photo&colors=grayscale&per_page=3`
    );
    const data = await res.json();
    return data.hits?.[0]?.largeImageURL || null;
}

export async function downloadAndSaveImage(imageUrl, filename) {
    const res = await fetch(imageUrl);
    const buffer = await res.buffer();

    const imagePath = path.join(process.cwd(), "public", "images", filename);
    fs.writeFileSync(imagePath, buffer);

    return `/images/${filename}`;
}
