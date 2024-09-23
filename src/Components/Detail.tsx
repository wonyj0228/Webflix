import { UseQueryOptions, useQueries } from 'react-query';
import styled from 'styled-components';
import { IMovie, ICast, getMovieCredit, getMovieDetail } from '../api';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, easeIn, motion } from 'framer-motion';
import { makeImgUrl, queryOption } from '../utils';

const Loading = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100px;
    height: 100px;
  }
`;

const Back = styled.div`
  position: absolute;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
`;

const Wrapper = styled(motion.div)`
  position: fixed;
  z-index: 99;
  width: 50vw;
  height: 80vh;
  top: 0;
  margin: 10vh 25%;
  background-color: ${(props) => props.theme.black.default};
  border-radius: 10px;
  box-shadow: 0 0 5px white;
  overflow-y: auto;
`;

const Img = styled.div<{ $bgImg: string }>`
  position: relative;
  height: 40vh;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(20, 20, 20, 0.9)),
    url(${(props) => props.$bgImg});
  background-size: 100% 100%;
  border-radius: 10px;
`;

const TitleBox = styled.div`
  position: absolute;
  bottom: 0;
  padding: 5% 10%;
`;

const Title = styled.p`
  font-size: 2rem;
  font-weight: 500;
  margin-bottom: 10px;
`;

const Tagline = styled.p`
  font-style: italic;
  font-size: 1rem;
  color: ${(props) => props.theme.gray.lighter};
`;

const Info = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const Genre = styled.span`
  display: inline-block;
  padding: 5px 20px;
  font-size: 0.8rem;
  background-color: ${(props) => props.theme.gray.default};
  border-radius: 5px;
  margin-right: 1rem;
`;

const About = styled.div`
  margin: 2rem 0;
  font-size: 0.8rem;

  div {
    margin-bottom: 10px;
  }
`;
const HeadCol = styled.span`
  color: ${(props) => props.theme.gray.lighter};
`;

const Casts = styled.div`
  font-size: 0.8rem;

  div:first-child {
    font-size: 1rem;
    font-weight: 400;
  }
  div {
    margin-bottom: 10px;
  }
`;

interface IProps {
  movieId: string;
}

const loadingVariants = {
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
const Detail = ({ movieId }: IProps) => {
  const navigate = useNavigate();

  const [{ data: detail }, { data: credit }] = useQueries<
    [UseQueryOptions<IMovie, unknown>, UseQueryOptions<ICast, unknown>]
  >([
    {
      queryKey: [`${movieId}`, 'detail'],
      queryFn: () => getMovieDetail(movieId),
      ...queryOption,
    },
    {
      queryKey: [`${movieId}`, 'credit'],
      queryFn: () => getMovieCredit(movieId),
      ...queryOption,
    },
  ]);

  return (
    <>
      <Back onClick={() => navigate(-1)} />
      <AnimatePresence>
        <Wrapper
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.3, ease: 'easeInOut' },
          }}
        >
          {detail && credit ? (
            <>
              <Img $bgImg={makeImgUrl(detail.backdrop_path)}>
                <TitleBox>
                  <Title>{detail.title}</Title>
                  <Tagline>{detail.tagline}</Tagline>
                </TitleBox>
              </Img>
              <Info>
                <div>
                  {detail.genres.map((genre) => (
                    <Genre key={genre.id}>{genre.name}</Genre>
                  ))}
                </div>

                <About>
                  <div>
                    <HeadCol>개봉일 | </HeadCol>
                    <span>{detail.release_date}</span>
                  </div>
                  <div>
                    <HeadCol>러닝타임 | </HeadCol>
                    <span>{`${detail.runtime}분`}</span>
                  </div>
                  <div>
                    <span>{detail.overview}</span>
                  </div>
                </About>

                <Casts>
                  <div>감독 및 출연</div>
                  <div>
                    <HeadCol>감독 | </HeadCol>
                    <span>{credit.crew[0].name}</span>
                  </div>
                  <div>
                    <HeadCol>출연 | </HeadCol>
                    <span>
                      {credit.cast.reduce(
                        (acc, cur) => acc + ' ' + cur.name,
                        ''
                      )}
                    </span>
                  </div>
                </Casts>
              </Info>
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
      </AnimatePresence>
    </>
  );
};

export default Detail;
