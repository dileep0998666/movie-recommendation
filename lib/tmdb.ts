import type { Movie, RecommendationParams, CastMember } from "./types";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  throw new Error("TMDB_API_KEY is not set in environment variables.");
}

/**
 * Fetches trending movies from TMDB API
 */
export async function getTrendingMovies(timeWindow = "day"): Promise<Movie[]> {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

/**
 * Searches for movies based on a query
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Failed to search movies: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

/**
 * Gets movie recommendations using TMDB discover endpoint
 */
export async function getMovieRecommendations(): Promise<Movie[]> {
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Failed to discover movies: ${res.status}`);
  }

  const data = await res.json();
  return data.results;
}

/**
 * Filters recommendations by genre and year range
 */
export function filterRecommendations(movies: Movie[], params: RecommendationParams): Movie[] {
  return movies.filter((movie) => {
    if (params.genreId && !movie.genre_ids.includes(params.genreId)) {
      return false;
    }

    if (movie.release_date) {
      const releaseYear = Number.parseInt(movie.release_date.split("-")[0]);
      if (params.startYear && releaseYear < params.startYear) {
        return false;
      }
      if (params.endYear && releaseYear > params.endYear) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Gets movie details by ID
 */
export async function getMovieDetails(movieId: number): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch movie details: ${res.status}`);
  }
  return res.json();
}

/**
 * Gets movie cast information by movie ID
 */
export async function getMovieCast(movieId: number): Promise<CastMember[]> {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch movie cast: ${res.status}`);
  }
  const data = await res.json();
  return data.cast || [];
}
// Add this function to your tmdb.ts file

/**
 * Gets person details and movie credits by person ID
 */
export async function getPersonDetails(personId: number): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits`,
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch person details: ${res.status}`);
  }
  return res.json();
}