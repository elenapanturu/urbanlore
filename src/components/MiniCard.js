import Image from "next/image";

export default function MiniCard({ place, onClick }) {
    return (
        <div
            className="bg-white dark:bg-neutral-800 force-dark-card text-gray-800 dark:text-gray-100 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onClick(place)}
        >
            <div className="relative w-full h-36 rounded-lg overflow-hidden">
                {place.image && place.image.length && place.image.length > 0 ? (
                    <Image
                        src={place.image}
                        alt={place.name}
                        layout="fill"
                        objectFit="cover"
                    />
                ) : <></>}

            </div>
            <h3 className="font-bold mt-2 text-lg">{place.description}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {place.city}, {place.country}
            </p>
        </div>
    );
}
