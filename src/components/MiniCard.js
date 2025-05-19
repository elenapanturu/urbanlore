import Image from "next/image";
import { Heart, HeartOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function MiniCard({ place, onClick, user }) {
    const [likes, setLikes] = useState(place.likes || 0);
    const [dislikes, setDislikes] = useState(place.dislikes || 0);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const vote = localStorage.getItem(`vote_${place._id}`);
            setUserVote(vote);
        }
    }, [place._id]);

    async function handleVote(type) {
        if (!user) return;

        const isSameVote = userVote === type;
        const newVote = isSameVote ? null : type;

        const res = await fetch(`/api/places/${place._id}/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                placeId: place._id,
                userId: user.userId,
                undo: isSameVote,
            }),
        });
        console.log("HELLO ", res);
        if (res.ok) {
            localStorage.setItem(`vote_${place._id}`, newVote || "");
            setUserVote(newVote);

            if (type === "like") {
                if (isSameVote) {
                    setLikes((prev) => prev - 1);
                } else {
                    setLikes((prev) => prev + 1);
                    if (userVote === "dislike") setDislikes((prev) => prev - 1);
                }
            } else if (type === "dislike") {
                if (isSameVote) {
                    setDislikes((prev) => prev - 1);
                } else {
                    setDislikes((prev) => prev + 1);
                    if (userVote === "like") setLikes((prev) => prev - 1);
                }
            }
        } else {
            const data = await res.json();
            console.error("Eroare la vot:", data.message);
        }
    }


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
            {user && (
                <div className="flex items-center gap-4 mt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleVote("like");
                        }}
                        className={`p-1 rounded-full transition text-white dark:text-black flex items-center gap-1 ${userVote === "like" ? "bg-pink-500 dark:bg-pink-300" : ""
                            }`}
                        aria-label="Like"
                    >
                        <Heart className="w-5 h-5" stroke="currentColor" fill="none" />
                        <span className="text-sm">{likes}</span>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleVote("dislike");
                        }}
                        className={`p-1 rounded-full transition text-white dark:text-black flex items-center gap-1 ${userVote === "dislike" ? "bg-red-500 dark:bg-red-300" : ""
                            }`}
                        aria-label="Dislike"
                    >
                        <HeartOff className="w-5 h-5" stroke="currentColor" fill="none" />
                        <span className="text-sm">{dislikes}</span>
                    </button>
                </div>
            )}

        </div>
    );
}
