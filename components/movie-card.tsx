import Image from "next/image";
import { Star } from "lucide-react";
import type { Movie } from "@/lib/types";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500";

  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-shadow">
        <div className="relative aspect-[2/3]">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-white line-clamp-1">{movie.title}</h3>
          <div className="flex items-center mt-1 text-sm text-slate-300">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{movie.vote_average.toFixed(1)}</span>
            <span className="mx-2">•</span>
            <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
