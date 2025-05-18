"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import MovieCard from "@/components/movie-card"
import { getTrendingMovies } from "@/lib/tmdb"
import type { Movie } from "@/lib/types"

interface TrendingMoviesProps {
  initialMovies: Movie[]
}

export default function TrendingMovies({ initialMovies }: TrendingMoviesProps) {
  const [timeWindow, setTimeWindow] = useState("day")
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [isLoading, setIsLoading] = useState(false)

  const handleTimeWindowChange = async (value: string) => {
    setTimeWindow(value)
    setIsLoading(true)

    try {
      const trendingMovies = await getTrendingMovies(value)
      setMovies(trendingMovies)
    } catch (error) {
      console.error("Error fetching trending movies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Tabs defaultValue="day" onValueChange={handleTimeWindowChange}>
        <TabsList className="bg-slate-700">
          <TabsTrigger value="day" className="data-[state=active]:bg-cyan-500">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-cyan-500">
            This Week
          </TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="mt-4">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="week" className="mt-4">
          {isLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
