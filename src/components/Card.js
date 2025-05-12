export default function Card({ place, onClose }) {
    const handleOverlayClick = () => {
        onClose();
    };

    const handleCardClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden relative"
                onClick={handleCardClick}
            >
                <button
                    className="absolute top-4 right-4 text-grey-700 text-xl font-bold hover:text-black cursor-pointer"
                    onClick={onClose}
                >
                    ×
                </button>

                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-36 object-cover rounded-t-lg"
                />

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-1">{place.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{place.location}</p>
                    <p className="mb-4">{place.description}</p>

                    <div className="flex gap-2 mb-4">
                        {place.categories.map((cat, index) => (
                            <span
                                key={index}
                                className="bg-black text-white text-xs px-2 py-1 rounded-full"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    {place.mapEmbed && (
                        <div className="aspect-video mt-4">
                            <iframe
                                src={place.mapEmbed}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}