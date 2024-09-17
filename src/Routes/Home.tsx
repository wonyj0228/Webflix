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
import { LayoutGroup, Variants, motion } from "framer-motion";
import { useMatch } from "react-router-dom";
import Detail from "../Components/Detail";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
`;

const Title = styled.div`
  font-size: 60px;
  font-weight: 500;
`;
const Overview = styled.p`
  font-size: 15px;
  width: 40%;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
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

const Loading = styled.div`
  height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100px;
    height: 100px;
  }
`;

const loadingVariants: Variants = {
  initial: { rotateZ: 0 },
  animate: {
    rotateZ: 360,
    transition: {
      ease: "linear",
      duration: 2,
      repeat: Infinity,
    },
  },
};

const Home = () => {
  const [bigMovie, setBigMovie] = useState<number>();
  const isDetail = useMatch("/:movieId");

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

  // 뒷배경 스크롤 막기
  if (isDetail) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <Wrapper>
      {popular.data && bigMovie ? (
        <>
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
            <LayoutGroup id="nowPlaying">
              {nowPlaying.data && (
                <Slider name="현재 상영작" data={nowPlaying.data} />
              )}
            </LayoutGroup>
          </BigMovie>

          <LayoutGroup id="topRated">
            {topRated.data && (
              <Slider name="평점이 좋은 영화" data={topRated.data} />
            )}
          </LayoutGroup>
          <LayoutGroup id="upcoming">
            {upcoming.data && (
              <Slider name="개봉 예정작" data={upcoming.data} />
            )}
          </LayoutGroup>

          {isDetail && <Detail movieId={isDetail.params.movieId || ""} />}
        </>
      ) : (
        <Loading>
          <motion.svg
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            stroke="white"
          >
            <line x1="32" y1="8" x2="32" y2="20" />
            <line x1="32" y1="56" x2="32" y2="44" />
            <line x1="56" y1="32" x2="44" y2="32" />
            <line x1="8" y1="32" x2="20" y2="32" />
            <line x1="48.97" y1="15.03" x2="40.49" y2="23.51" />
            <line x1="15.03" y1="48.97" x2="23.51" y2="40.49" />
            <line x1="48.97" y1="48.97" x2="40.49" y2="40.49" />
            <line x1="15.03" y1="15.03" x2="23.51" y2="23.51" />
          </motion.svg>
        </Loading>
      )}
    </Wrapper>
  );
};

export default Home;
