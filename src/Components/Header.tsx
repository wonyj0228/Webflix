import {
  Variants,
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import React from 'react';
import media from '../media';

const Nav = styled(motion.nav)<{ $searchDisplay: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
  padding: 10px 5%;
  display: flex;
  justify-content: space-between;
  z-index: 99;

  /* div:last-child {
    display: ${(props) => (props.$searchDisplay ? 'block' : 'none')};
  } */

  ${media.extraSmall`
    font-size : 10px;
  `}
  ${media.medium`
    font-size : 13px;
  `}
  ${media.large`
    font-size : 15px;
  `}
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  width: 90px;
  height: 60px;
  margin-right: 50px;
  cursor: pointer;
`;

const Item = styled.li`
  list-style-type: none;
  margin-right: 30px;
`;

const Search = styled.form`
  svg {
    height: 20px;
    cursor: pointer;
  }
  ${media.extraSmall`
    display:none;
  `}
  ${media.small`
    display:block;
  `}
`;

const SearchBtn = styled.div`
  display: flex;
  align-items: center;
  svg {
    height: 20px;
    cursor: pointer;
  }
  ${media.extraSmall`
    display:block;
  `}
  ${media.small`
      display:none;
  `}
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  width: 250px;
  font-size: 1em;
  border: white 0.7px solid;
  padding: 10px 10px 10px 45px;
  outline: none;
  background-color: ${(props) => props.theme.black.darker};
  color: ${(props) => props.theme.white.default};
`;

const LogoVariants: Variants = {
  normal: {
    fillOpacity: 1,
  },
  hover: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants: Variants = {
  top: {
    backgroundColor: '#14141419',
  },
  scroll: {
    backgroundColor: '#141414',
    transition: {
      duration: 0.1,
    },
  },
};

const Header = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [search, setSearch] = useState(false);
  const navAnimation = useAnimation();
  const { register, handleSubmit, setFocus, setValue } = useForm<{
    query: string;
  }>();
  const isSearch = useMatch('/search');

  const inputVariants: Variants = {
    initial: {
      scale: 0,
    },
    animate: {
      scale: search ? 1 : 0,
      transition: {
        delay: 0.1,
      },
    },
  };

  useMotionValueEvent(scrollY, 'change', () => {
    if (scrollY.get() > 80) {
      navAnimation.start('scroll');
    } else {
      navAnimation.start('top');
    }
  });

  const onValidSubmit: SubmitHandler<{ query: string }> = (data) => {
    navigate(`/search?query=${data.query}`);
  };

  const setSearchMode = () => {
    if (search) {
      setValue('query', '');
      setSearch(false);
    } else {
      setSearch(true);
      setFocus('query');
    }
  };

  const onBlur = () => {
    setValue('query', '');
    setSearch(false);
  };

  return (
    <Nav
      $searchDisplay={isSearch ? false : true}
      variants={navVariants}
      initial="top"
      animate={navAnimation}
    >
      <Col>
        <Logo
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 276.742"
          onClick={() => navigate('/')}
          variants={LogoVariants}
          initial="normal"
          whileHover="hover"
        >
          <path
            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
            fill="#d81f26"
          />
        </Logo>
        <Item>
          <Link to={'/'}>영화</Link>
        </Item>
        <Item>
          <Link to={'/trend'}>트랜드</Link>
        </Item>
      </Col>
      <Col>
        <Search onSubmit={handleSubmit(onValidSubmit)}>
          <motion.svg
            onClick={setSearchMode}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ x: 250, y: 5 }}
            animate={{
              x: search ? 35 : 250,
              y: 5,
              transition: {
                type: 'ease',
                duration: 0.2,
              },
            }}
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register('query')}
            autoComplete="off"
            onBlur={onBlur}
            variants={inputVariants}
            initial="initial"
            animate="animate"
            placeholder="Search for movie.."
          />
        </Search>
        <SearchBtn onClick={() => navigate('/search')}>
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </SearchBtn>
      </Col>
    </Nav>
  );
};

export default React.memo(Header);
