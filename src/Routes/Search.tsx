import { useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { IMovie, searchMovies } from '../api';
import { motion } from 'framer-motion';
import { makeImgUrl } from '../utils';
import Detail from '../Components/Detail';

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 0 5%;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* font-size: 20px; */
`;

const SearchBox = styled.form`
  position: relative;
  padding-top: 10rem;
  display: flex;
  align-items: end;
  padding-bottom: 10px;
  width: 70%;
  border-bottom: 1px solid ${(props) => props.theme.white.default};
  svg {
    width: 60px;
  }
`;

const SearchInput = styled.input`
  width: 95%;
  height: 4rem;
  margin-right: 10px;
  font-family: inherit;
  font-size: 2rem;
  color: ${(props) => props.theme.white.default};
  background-color: inherit;
  outline: none;
  border: none;
`;

const ErrorMessage = styled.p`
  position: absolute;
  bottom: -3rem;
  color: ${(props) => props.theme.darkRed};
`;

const ResultsBox = styled.div`
  margin-top: 10rem;
  width: 100%;
`;

const Loading = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100px;
    height: 100px;
  }
`;

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

const SearchWord = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  grid-row-gap: 30px;
  width: 100%;
`;

const Item = styled(motion.div)<{ $bgImg: string }>`
  background-image: url(${(props) => props.$bgImg});
  background-size: 100% 100%;
  border-radius: 5px;
  box-shadow: 0 0 3px gray;
  height: 16rem;
  cursor: pointer;
`;

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get('query');

  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit } = useForm<{ query: string }>();
  const navigate = useNavigate();

  const isDetail = useMatch('/search/:movieId');

  const { data, isLoading, remove } = useQuery<IMovie[]>(
    'search',
    () => searchMovies(queryString || ''),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  useEffect(() => {
    return () => {
      remove();
    };
  }, []);

  const onValidSubmit: SubmitHandler<{ query: string }> = (data) => {
    if (data.query !== queryString) {
      remove();
      setErrorMsg('');
      navigate(`/search?query=${data.query}`);
    }
  };
  const onInvalidSubmit: SubmitErrorHandler<{ query: string }> = (error) => {
    if (error.query) {
      setErrorMsg(error.query.message as string);
    }
  };

  if (isDetail) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return (
    <Wrapper>
      <SearchBox onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <SearchInput
          {...register('query', { required: '검색어를 입력해주세요' })}
          autoComplete="off"
          placeholder="영화 제목을 검색해보세요"
          defaultValue={queryString || ''}
        />
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
        <ErrorMessage>{errorMsg}</ErrorMessage>
      </SearchBox>
      <ResultsBox>
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
        ) : data && data.length > 0 ? (
          <>
            <SearchWord>{`'${queryString}' 검색 결과`}</SearchWord>
            <Row>
              {data.map((movie) => {
                return (
                  <Item
                    key={movie.id}
                    onClick={() =>
                      navigate(`/search/${movie.id}?query=${queryString}`)
                    }
                    layoutId={movie.id + ''}
                    $bgImg={makeImgUrl(movie.poster_path, 'w500')}
                    whileHover={{
                      scale: 1.2,
                      zIndex: 90,
                      transition: { delay: 0.2 },
                    }}
                  />
                );
              })}
            </Row>
          </>
        ) : null}
      </ResultsBox>
      {isDetail && <Detail movieId={isDetail.params.movieId || ''} />}
    </Wrapper>
  );
};

export default Search;
