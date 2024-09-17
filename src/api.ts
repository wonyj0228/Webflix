const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_TMDB_API;

export interface IMovie {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  tagline: string;
}

export const getNowPlaying = () => {
  return fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=KR`
  )
    .then((res) => res.json())
    .then((data) => data.results);
};
export const getPopularMovie = () => {
  return fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR&region=KR`
  )
    .then((res) => res.json())
    .then((data) => data.results);
};
export const getTopRatedMovie = () => {
  return fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko-KR&region=KR`
  )
    .then((res) => res.json())
    .then((data) => data.results);
};
export const getUpcomingMovie = () => {
  return fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&region=KR`
  )
    .then((res) => res.json())
    .then((data) => data.results);
};

export const getMovieDetail = (movieId: string) => {
  return fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  ).then((res) => res.json());
};
