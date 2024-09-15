import { UseQueryOptions, useQueries } from "react-query";
import {
  IMovie,
  getNowPlaying,
  getPopularMovie,
  getTopRatedMovie,
  getUpcomingMovie,
} from "../api";
import styled from "styled-components";
import { makeImgUrl } from "../utils";
import { useEffect, useState } from "react";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BigMovie = styled.div<{ $bgImg: string }>`
  width: 100%;
  height: 95vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${(props) => props.$bgImg});
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 280px;
  padding: 0 5%;
  margin-bottom: 100px;
`;

const Title = styled.div`
  font-size: 60px;
  font-weight: 500;
`;
const Overview = styled.p`
  font-size: 15px;
  width: 40%;
`;
const Btn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  background-color: rgba(40, 40, 40, 0.9);
  color: white;
  font-weight: 300;
  font-size: 18px;
  border-radius: 5px;
  cursor: pointer;

  svg {
    width: 20px;
    fill: white;
    margin-right: 10px;
  }
`;

const Home = () => {
  const [bigMovie, setBigMovie] = useState<number>(0);
  const option = {
    staleTime: 600000, // 10분
    cacheTime: 900000, // 15분
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  };
  const queries = [
    { queryKey: ["movies", "nowPlaying"], queryFn: getNowPlaying, ...option },
    { queryKey: ["movies", "popular"], queryFn: getPopularMovie, ...option },
    { queryKey: ["movies", "topRated"], queryFn: getTopRatedMovie, ...option },
    { queryKey: ["movies", "upcoming"], queryFn: getUpcomingMovie, ...option },
  ];
  const totalData = useQueries<UseQueryOptions<IMovie[], unknown>[]>(queries);
  const [nowPlaying, popular, topRated, upcoming] = totalData;

  useEffect(() => {
    // BigMovie
    if (!popular.isLoading) {
      const bigMovieIdx = Math.ceil(Math.random() * 19);
      setBigMovie(bigMovieIdx);
    }
  }, [popular.isLoading]);

  return (
    <Wrapper>
      {popular.data ? (
        <BigMovie $bgImg={makeImgUrl(popular.data[bigMovie].backdrop_path)}>
          <Info>
            <Title>{popular.data[bigMovie].title}</Title>
            <Overview>{popular.data[bigMovie].overview}</Overview>
            <Btn>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
              상세정보
            </Btn>
          </Info>
          {nowPlaying.data ? (
            <Slider name="Now Playing" data={nowPlaying.data} />
          ) : (
            <div>Loading...</div>
          )}
        </BigMovie>
      ) : (
        <div>Loading...</div>
      )}
    </Wrapper>
  );
};

export default Home;
