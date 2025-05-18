import MovieSearch from "@/components/movie-search"
import TrendingMovies from "@/components/trending-movies"
import RecommendationEngine from "@/components/recommendation-engine"
import { getTrendingMovies } from "@/lib/tmdb"

export default async function Home() {
  const trendingMovies = await getTrendingMovies()

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Movie Recommendation Bot</h1>
          <p className="text-xl text-slate-300">Discover your next favorite movie</p>
        </header>

        <MovieSearch />

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Trending Movies</h2>
          <TrendingMovies initialMovies={trendingMovies} />
        </section>

        <section className="mt-16 mb-20">
          <h2 className="text-2xl font-semibold text-white mb-6">Get Personalized Recommendations</h2>
          <RecommendationEngine />
        </section>
      </div>
    </main>
  )
}
