import { useQuery } from 'react-query';
import { getTrendMovies, IMovie } from '../api';
import { queryOption } from '../utils';
import { motion, Variants } from 'framer-motion';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0 5%;
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
  console.log(data);
  return (
    <Wrapper>
      {isLoading ? (
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
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default Trend;
