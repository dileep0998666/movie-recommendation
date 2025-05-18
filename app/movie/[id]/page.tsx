import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Calendar, Clock, Users, Globe, BanknoteIcon } from "lucide-react"
import { getMovieDetails, getMovieCast } from "@/lib/tmdb"
import type { CastMember } from "@/lib/types"
import type { Metadata } from "next";


interface MoviePageProps  {
  params: {
    id: string;
  };
}


export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovieDetails(Number.parseInt(params.id))
  const cast = await getMovieCast(Number.parseInt(params.id))
  
  // Filter to display only top 8 cast members
  const topCast = cast.slice(0, 8)

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.svg?height=750&width=500"

  // Format currency with commas
  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    })
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {backdropUrl && (
          <div className="relative w-full h-[70vh]">
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          </div>
        )}

        {/* Content overlay on hero */}
        <div className="container mx-auto px-4 relative">
          <div className="absolute bottom-8 left-0 right-0 px-4 md:px-8">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 mb-6 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to recommendations
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
              {movie.title}
            </h1>
            
            {movie.tagline && (
              <p className="italic text-white/80 text-xl mb-4 drop-shadow-md">
                "{movie.tagline}"
              </p>
            )}
            
            {/* Rating and quick stats */}
            <div className="flex items-center flex-wrap gap-4 text-white/90 mb-6">
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="h-5 w-5 text-yellow-400 mr-1 fill-yellow-400" />
                <span className="font-medium">{movie.vote_average?.toFixed(1)}</span>
              </div>

              {movie.release_date && (
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Calendar className="h-5 w-5 mr-1 text-cyan-400" />
                  <span>{movie.release_date.split("-")[0]}</span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Clock className="h-5 w-5 mr-1 text-cyan-400" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Poster and action buttons */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover rounded-xl shadow-lg"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            
            {/* Genre tags */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-cyan-800/80 hover:bg-cyan-700 transition-colors text-white text-sm px-3 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="space-y-2 pt-4">
              <button className="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-white py-3 rounded-lg font-medium">
                Add to Watchlist
              </button>
              <button className="w-full bg-slate-700 hover:bg-slate-600 transition-colors text-white py-3 rounded-lg font-medium">
                Mark as Watched
              </button>
            </div>
          </div>

          {/* Movie details */}
          <div className="space-y-8">
            {/* Overview section */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed">{movie.overview}</p>
            </div>
            
            {/* Additional details */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-4">Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Production companies */}
                {movie.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white/90 mb-2 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-cyan-400" />
                      Production
                    </h3>
                    <ul className="text-slate-300">
                      {movie.production_companies.slice(0, 3).map((company) => (
                        <li key={company.id}>{company.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Languages */}
                {movie.spoken_languages?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white/90 mb-2 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-cyan-400" />
                      Languages
                    </h3>
                    <p className="text-slate-300">
                      {movie.spoken_languages.map(lang => lang.english_name).join(", ")}
                    </p>
                  </div>
                )}
                
                {/* Budget */}
                {movie.budget > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white/90 mb-2 flex items-center">
                      <BanknoteIcon className="h-5 w-5 mr-2 text-cyan-400" />
                      Budget
                    </h3>
                    <p className="text-slate-300">{formatCurrency(movie.budget)}</p>
                  </div>
                )}
                
                {/* Revenue */}
                {movie.revenue > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white/90 mb-2 flex items-center">
                      <BanknoteIcon className="h-5 w-5 mr-2 text-cyan-400" />
                      Revenue
                    </h3>
                    <p className="text-slate-300">{formatCurrency(movie.revenue)}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Cast section with real data */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Cast</h2>
                {cast.length > 8 && (
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium">
                    View All Cast
                  </button>
                )}
              </div>
              
              {topCast.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {topCast.map((person) => {
                    const profileImg = person.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : "/placeholder.svg?height=185&width=185";
                      
                    return (
                      <div key={person.credit_id} className="bg-slate-700/50 rounded-lg overflow-hidden transition-transform hover:scale-105">
                        <div className="relative aspect-square">
                          <Image 
                            src={profileImg}
                            alt={person.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-white truncate">{person.name}</p>
                          <p className="text-sm text-slate-400 truncate">{person.character}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-6 text-center">
                  <Users className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400">No cast information available for this movie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}