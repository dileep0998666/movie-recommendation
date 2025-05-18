"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import MovieCard from "@/components/movie-card"
import { searchMovies } from "@/lib/tmdb"
import type { Movie } from "@/lib/types"

export default function MovieSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const searchResults = await searchMovies(query)
      setResults(searchResults)
    } catch (error) {
      console.error("Error searching movies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-slate-700 text-white border-slate-600 focus-visible:ring-cyan-500"
        />
        <Button type="submit" disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-600">
          {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-white mb-4">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
