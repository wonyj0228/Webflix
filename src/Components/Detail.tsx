import { useQuery } from "react-query";
import styled from "styled-components";
import { IMovie, getMovieDetail } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { makeImgUrl } from "../utils";

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

const Wrapper = styled.div`
  position: fixed;
  z-index: 100;
  width: 50vw;
  height: 80vh;
  top: 10vh;
  margin: 0 25%;
  background-color: ${(props) => props.theme.black.default};
  border-radius: 10px;
  box-shadow: 0 0 5px white;
`;

const Img = styled.div<{ $bgImg: string }>`
  position: relative;
  height: 40vh;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)),
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
interface IProps {
  movieId: string;
}

const loadingVariants = {
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
const Detail = ({ movieId }: IProps) => {
  const option = {
    staleTime: 600000, // 10분
    cacheTime: 900000, // 15분
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  };
  const { isLoading, data } = useQuery<IMovie>(
    ["movie", `${movieId}`],
    () => getMovieDetail(movieId),
    option
  );
  console.log(data);
  const navigate = useNavigate();

  return (
    <>
      <Back onClick={() => navigate(-1)} />
      <Wrapper>
        {!isLoading && data ? (
          <>
            <Img $bgImg={makeImgUrl(data.backdrop_path)}>
              <TitleBox>
                <Title>{data.title}</Title>
                <Tagline>{data.tagline}</Tagline>
              </TitleBox>
            </Img>
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
    </>
  );
};

export default Detail;
