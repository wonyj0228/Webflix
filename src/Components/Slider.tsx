import styled from 'styled-components';
import { IMovie } from '../api';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { makeImgUrl, useWindowDimensions } from '../utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import media from '../media';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5%;
`;
const HeadTitle = styled.div`
  padding: 0 5%;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.5rem;
`;
const Cards = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 0 5%;

  ${media.extraSmall`
    height : 200px;
  `}
  ${media.small`
    height : 150px;
  `}
  ${media.medium`
    height : 180px;
  `}
  ${media.large`
    height : 250px;
  `}
  ${media.extraLarge`
    height : 320px;
  `}
`;

const Row = styled(motion.div)<{ $itemCnt: number }>`
  position: absolute;
  left: 5%;
  right: 5%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.$itemCnt}, 1fr);
  gap: 10px;
  height: 100%;
  width: 90%;
`;

const Item = styled(motion.img)`
  width: 100%;
  height: 100%;
  min-height: 100%;
  border-radius: 5px;
  box-shadow: 0 0 3px gray;
  cursor: pointer;
`;

const Btn = styled(motion.div)`
  position: absolute;
  width: calc(5% - 5px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  svg {
    width: 30px;
    fill: white;
  }
`;

interface IProps {
  name: string;
  data: IMovie[];
}

const Slider = ({ name, data }: IProps) => {
  const navigate = useNavigate();
  const width = useWindowDimensions();

  const [itemCnt, setItemCnt] = useState(width >= 600 ? 6 : 3);
  const [idx, setIdx] = useState(0);
  const [next, setNext] = useState(true);

  useEffect(() => {
    if (width >= 600 && itemCnt === 3) {
      setItemCnt(6);
      if (idx % 6 !== 0) {
        setIdx((prev) => prev - 3);
      }
    } else if (width < 600 && itemCnt === 6) {
      setItemCnt(3);
    }
  }, [width]);

  const nextOnClick = () => {
    setIdx((prev) => prev + itemCnt);
    setNext(true);
  };
  const prevOnClick = () => {
    setIdx((prev) => prev - itemCnt);
    setNext(false);
  };

  const rowVariants: Variants = {
    initial: (next) => ({ x: next ? width + 10 : -width - 10 }),
    exit: (next) => ({ x: next ? -width - 10 : width + 10 }),
    animate: { x: 0 },
  };

  return (
    <Wrapper>
      <HeadTitle>{name}</HeadTitle>
      <Cards>
        <AnimatePresence custom={next} initial={false}>
          <Row
            $itemCnt={itemCnt}
            key={idx}
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={next}
            transition={{ ease: 'easeInOut', duration: 0.5 }}
          >
            {data.slice(idx, idx + itemCnt).map((movie) => {
              return (
                <Item
                  key={movie.id}
                  alt={`${movie.title}의 포스터 이미지`}
                  onClick={() => navigate(`/${movie.id}`)}
                  src={makeImgUrl(movie.poster_path, 'w500')}
                  whileHover={{
                    scaleY: 1.2,
                    scaleX: 1.1,
                    zIndex: 90,
                    transition: { delay: 0.2 },
                  }}
                ></Item>
              );
            })}
          </Row>
        </AnimatePresence>
        {idx !== 0 ? (
          <Btn onClick={prevOnClick} style={{ left: 0, top: 0 }}>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </motion.svg>
          </Btn>
        ) : null}
        {idx !== 18 - itemCnt ? (
          <Btn onClick={nextOnClick} style={{ right: 0, top: 0 }}>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
            >
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </motion.svg>
          </Btn>
        ) : null}
      </Cards>
    </Wrapper>
  );
};

export default Slider;
