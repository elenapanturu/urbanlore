import { useEffect, useState } from "react";
import Image from "next/image";
import { getCoordinates } from "../../utils/geocode";
import content from "@/data/content.json";

export default function Card({ place, onClose, lang }) {
    const t = content[lang];
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            const coords = await getCoordinates(place.name);
            setCoordinates(coords);
        };

        fetchCoordinates();
    }, [place.name]);

    if (!place) return null;

    const handleOverlayClick = () => {
        onClose();
    };

    const handleCardClick = (e) => {
        e.stopPropagation();
    };

    const googleMapsUrl = coordinates
        ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
        : null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white dark:bg-neutral-900 force-dark-card text-gray-900 dark:text-gray-100 w-full max-w-md rounded-xl shadow-xl overflow-hidden relative"
                onClick={handleCardClick}
            >
                <button
                    className="absolute top-4 right-4 text-white text-xl font-bold hover:text-black cursor-pointer"
                    onClick={onClose}
                >
                    ×
                </button>
                {place.image && place.image.length && place.image.length > 0 ? (
                    <Image
                        src={place.image}
                        alt={place.name}
                        className="w-full h-auto max-h-64 object-contain rounded-t-lg"
                        width={1200}
                        height={675}
                    />
                ) : (<></>)}

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-1">{place.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{place.city + ", " + place.country}</p>
                    <p className="mb-4">{place.story}</p>

                    <div className="flex gap-2 mb-4">
                        {place.categories && place.categories.map((cat, index) => (
                            <span
                                key={index}
                                className="bg-black text-white text-xs px-2 py-1 rounded-full"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    {googleMapsUrl && (
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-black dark:bg-white force-dark-button text-white dark:text-black px-4 py-2 rounded-lg mt-4 hover:bg-gray-800 dark:hover:bg-gray-200"
                        >
                            {t.textGetDirections}
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}