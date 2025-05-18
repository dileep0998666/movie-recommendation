"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MovieCard from "@/components/movie-card"
import { getMovieRecommendations } from "@/lib/tmdb"
import type { Movie } from "@/lib/types"

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
]

export default function RecommendationEngine() {
  const [selectedGenre, setSelectedGenre] = useState("")
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()])
  const [favoriteMovie, setFavoriteMovie] = useState("")
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleGetRecommendations = async () => {
    setIsLoading(true)
    try {
      const results = await getMovieRecommendations()
      setRecommendations(results)
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="genre" className="text-white mb-2 block">
            Genre
          </Label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-slate-700 text-white border-slate-600">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 text-white border-slate-600">
              <SelectItem value="any">Any Genre</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="favorite-movie" className="text-white mb-2 block">
            Favorite Movie (Optional)
          </Label>
          <Input
            id="favorite-movie"
            placeholder="Enter a movie you love"
            value={favoriteMovie}
            onChange={(e) => setFavoriteMovie(e.target.value)}
            className="bg-slate-700 text-white border-slate-600"
          />
        </div>
      </div>

      <div className="mb-8">
        <Label className="text-white mb-4 block">
          Release Year Range: {yearRange[0]} - {yearRange[1]}
        </Label>
        <Slider
          defaultValue={yearRange}
          min={1900}
          max={new Date().getFullYear()}
          step={1}
          onValueChange={setYearRange}
          className="my-6"
        />
      </div>

      <Button
        onClick={handleGetRecommendations}
        disabled={isLoading}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
      >
        {isLoading ? "Finding Movies..." : "Get Recommendations"}
      </Button>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-white mb-4">Your Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
