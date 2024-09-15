import styled from "styled-components";
import { IMovie } from "../api";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { makeImgUrl, useWindowDimensions } from "../utils";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const HeadTitle = styled.div`
  padding: 0 5%;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 15px;
`;
const Cards = styled.div`
  position: relative;
  height: 130px;
  padding: 0 5%;

  div:first-child {
    left: 0;
    top: 0;
  }
  div:last-child {
    right: 0;
    top: 0;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  height: 100%;
`;

const Item = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: 100% 100%;
  border-radius: 5px;
  box-shadow: 0 0 3px gray;
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

const arrowVariants: Variants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
  },
};

const Slider = ({ name, data }: IProps) => {
  const width = useWindowDimensions();

  const rowVariants = {
    right: { x: width + 10 },
    animate: { x: 0, transition: { ease: "linear", duration: 0.5 } },
    left: { x: -width - 10 },
  };

  const [idx, setIdx] = useState<number>(0);
  const [prev, setPrev] = useState(false);

  const nextOnClick = () => {
    setIdx((prev) => prev + 1);
    setPrev(false);
  };
  const prevOnClick = () => {
    setIdx((prev) => prev - 1);
    setPrev(true);
  };

  return (
    <Wrapper>
      <HeadTitle>{name}</HeadTitle>
      <AnimatePresence initial={false}>
        <Cards>
          {idx !== 0 ? (
            <Btn
              variants={arrowVariants}
              initial="initial"
              animate="animate"
              onClick={prevOnClick}
            >
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
          <Row
            key={idx}
            variants={rowVariants}
            initial={prev ? "left" : "right"}
            animate="animate"
            exit={prev ? "right" : "left"}
          >
            {data.slice(idx * 6, idx * 6 + 6).map((movie) => {
              return (
                <Item
                  layoutId={movie.id + ""}
                  $bgImg={makeImgUrl(movie.backdrop_path, "w500")}
                ></Item>
              );
            })}
          </Row>
          {idx !== 2 ? (
            <Btn
              variants={arrowVariants}
              initial="initial"
              animate="animate"
              onClick={nextOnClick}
            >
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
      </AnimatePresence>
    </Wrapper>
  );
};

export default Slider;
