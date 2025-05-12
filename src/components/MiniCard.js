import Image from "next/image";

export default function MiniCard({ place, onClick }) {
    return (
        <div
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onClick(place)}
        >
            <div className="relative w-full h-36 rounded-lg overflow-hidden">
                <Image
                    src={place.image}
                    alt={place.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <h3 className="font-bold mt-2 text-lg text-gray-900">{place.name}</h3>
            <p className="text-sm text-gray-600">{place.location}</p>
        </div>
    );
}
