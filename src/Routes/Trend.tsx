import { useQuery } from 'react-query';
import { getMovieGenres, getTrendMovies, IMovie } from '../api';
import { makeImgUrl, queryOption } from '../utils';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { genreState } from '../atom';

const Wrapper = styled.div`
  width: 100%;
  min-width: 900px;
  height: 100vh;
  min-height: 600px;
  padding: 0 5% 0 0;
  display: flex;
  font-size: 15px;
  overflow: hidden;
`;

const Loading = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100px;
    height: 100px;
  }
`;

const BigMovie = styled.div`
  position: relative;
  width: 75%;
  height: 100%;
`;

const BigBg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  filter: brightness(0.5);
`;

const InfoWrapper = styled.div`
  position: absolute;
  padding-top: 20%;
  padding-left: 5%;
  padding-bottom: 20%;
`;

const Title = styled.div`
  font-size: 4rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;
const Genre = styled.span`
  display: inline-block;
  padding: 5px 20px;
  font-size: 1rem;
  background-color: ${(props) => props.theme.gray.default};
  border-radius: 5px;
  margin-right: 1rem;
`;

const Release = styled.div`
  font-size: 1rem;
  margin-top: 4rem;
  margin-bottom: 20px;
  span:first-child {
    color: ${(props) => props.theme.gray.lighter};
  }
`;

const Overview = styled.p`
  font-size: 1rem;
  width: 70%;
`;

const List = styled.div`
  position: relative;
  width: 25%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr;

  img:first-child {
    position: absolute;
    top: -10%;
    border-radius: 0 0 20px 20px;
  }

  img:last-child {
    position: absolute;
    bottom: -10%;
    border-radius: 20px 20px 0 0;
  }
`;

const BackPoster = styled(motion.img)`
  width: 100%;
  height: 50%;
  min-height: 50%;
  box-shadow: 0 0 20px gray;
  border-left: 1.5px solid gray;
  cursor: pointer;
  filter: brightness(0.5);
`;

const FrontPoster = styled(motion.img)`
  position: absolute;
  z-index: 1;
  width: 110%;
  height: 60%;
  left: -55%;
  top: 20%;
  border-radius: 20px;
  box-shadow: 0 0 30px gray;
`;

const loadingVariants: Variants = {
  initial: { rotateZ: 0 },
  animate: {
    rotateZ: 360,
    transition: {
      ease: 'linear',
      duration: 2,
      repeat: Infinity,
    },
  },
};

const Trend = () => {
  const { data, isLoading } = useQuery<IMovie[]>(
    'trending',
    getTrendMovies,
    queryOption
  );
  const [genreArr, setGenreArr] = useRecoilState(genreState);

  const { data: genreData, isLoading: genreIsLoading } = useQuery(
    'genres',
    getMovieGenres,
    { ...queryOption, enabled: genreArr === undefined }
  );

  useEffect(() => {
    if (!genreIsLoading) {
      setGenreArr(genreData.genres);
    }
  }, [genreIsLoading]);

  const [curIdx, setCurIdx] = useState<number[]>([19, 0, 1]);
  const prevMovie = () => {
    setCurIdx((bfArr) => {
      return bfArr.map((v) => (v === 0 ? 19 : v - 1));
    });
  };

  const nextMovie = () => {
    setCurIdx((bfArr) => {
      return bfArr.map((v) => (v === 19 ? 0 : v + 1));
    });
  };

  return (
    <Wrapper>
      {data && !isLoading && genreArr ? (
        <>
          <BigMovie>
            <BigBg src={makeImgUrl(data[curIdx[1]].backdrop_path)} />
            <InfoWrapper>
              <Title>{data[curIdx[1]].title}</Title>
              <div>
                {data[curIdx[1]].genre_ids.map((id) => {
                  const idx = genreArr.findIndex((genre) => genre.id === id);
                  return (
                    <Genre key={genreArr[idx].id}>{genreArr[idx].name}</Genre>
                  );
                })}
              </div>
              <Release>
                <span>개봉 |</span>
                <span> {data[curIdx[1]].release_date}</span>
              </Release>
              <Overview>{data[curIdx[1]].overview}</Overview>
            </InfoWrapper>
          </BigMovie>

          <AnimatePresence>
            <List>
              <BackPoster
                key={data[curIdx[0]].id}
                src={makeImgUrl(data[curIdx[0]].poster_path)}
                onClick={prevMovie}
              ></BackPoster>
              <FrontPoster
                key={data[curIdx[1]].id}
                src={makeImgUrl(data[curIdx[1]].poster_path)}
                initial={{ opacity: 0.5, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
              />
              <BackPoster
                key={data[curIdx[2]].id}
                src={makeImgUrl(data[curIdx[2]].poster_path)}
                onClick={nextMovie}
              ></BackPoster>
            </List>
          </AnimatePresence>
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

export default Trend;
