import { useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { IMovie, searchMovies } from '../api';
import { motion } from 'framer-motion';
import { makeImgUrl, useWindowDimensions } from '../utils';
import Detail from '../Components/Detail';
import media from '../media';

const Wrapper = styled.div`
  position: relative;
  padding: 0 5%;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchBox = styled.form`
  position: relative;
  padding-top: 10rem;
  display: flex;
  align-items: center;
  padding-bottom: 2px;
  width: 70%;
  border-bottom: 1px solid ${(props) => props.theme.white.default};
  svg {
    width: 2rem;
  }
`;

const SearchInput = styled.input`
  width: 95%;
  height: 4rem;
  margin-right: 10px;
  font-family: inherit;
  font-size: 1.2rem;
  color: ${(props) => props.theme.white.default};
  background-color: inherit;
  outline: none;
  border: none;
`;

const ErrorMessage = styled.p`
  position: absolute;
  bottom: -3rem;
  color: ${(props) => props.theme.darkRed};
  font-size: 1rem;
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
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 30px;
`;

const Row = styled.div<{ $itemCnt: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.$itemCnt}, 1fr);
  grid-gap: 10px;
  grid-row-gap: 30px;
  justify-items: center;
`;

const Item = styled(motion.img)`
  border-radius: 5px;
  box-shadow: 0 0 3px gray;
  cursor: pointer;
  ${media.extraSmall`
    height :150px;
  `}
  ${media.small`
    height : 180px;
  `}
  ${media.medium`
    height : 200px;
  `}
  ${media.large`
    height : 230px;
  `}
  ${media.extraLarge`
    height : 280px;
  `}
`;

const NoImgItem = styled(motion.div)`
  border-radius: 5px;
  box-shadow: 0 0 3px gray;
  aspect-ratio: 1/1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  cursor: pointer;
  background-color: ${(props) => props.theme.gray.default};
  ${media.extraSmall`
    height :150px;
  `}
  ${media.small`
    height : 180px;
  `}
  ${media.medium`
    height : 200px;
  `}
  ${media.large`
    height : 230px;
  `}
  ${media.extraLarge`
    height : 280px;
  `}

  svg {
    width: 5rem;
    fill: ${(props) => props.theme.darkRed};
  }
  p:first-child {
    font-size: 1.2rem;
  }
  p:last-child {
    font-size: 1.5rem;
    font-weight: 500;
    padding: 0 5%;
  }
`;

const NoResults = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  svg {
    width: 5rem;
    fill: ${(props) => props.theme.darkRed};
  }
  p {
    font-size: 2rem;
  }
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

  const width = useWindowDimensions();
  const [itemCnt, setItemCnt] = useState<number>(0);

  useEffect(() => {
    if (width <= 600) {
      setItemCnt(3);
    } else if (width < 800 && width > 600) {
      setItemCnt(4);
    } else if (width < 1300 && width >= 800) {
      setItemCnt(5);
    } else if (width >= 1300) {
      setItemCnt(6);
    }
  }, [width]);

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
            <Row $itemCnt={itemCnt}>
              {data.map((movie) =>
                movie.poster_path ? (
                  <Item
                    key={movie.id}
                    onClick={() =>
                      navigate(`/search/${movie.id}?query=${queryString}`)
                    }
                    src={makeImgUrl(movie.poster_path, 'w500')}
                    whileHover={{
                      scale: 1.2,
                      zIndex: 90,
                      transition: { delay: 0.2 },
                    }}
                  />
                ) : (
                  <NoImgItem
                    key={movie.id}
                    onClick={() =>
                      navigate(`/search/${movie.id}?query=${queryString}`)
                    }
                    whileHover={{
                      scale: 1.2,
                      zIndex: 90,
                      transition: { delay: 0.2 },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                    >
                      <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                    <p>no image</p>
                    <p>{movie.title}</p>
                  </NoImgItem>
                )
              )}
            </Row>
          </>
        ) : (
          <NoResults>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
            <p>{`"${queryString}"`}</p>
            <p>검색 결과가 없습니다.</p>
          </NoResults>
        )}
      </ResultsBox>
      {isDetail && <Detail movieId={isDetail.params.movieId || ''} />}
    </Wrapper>
  );
};

export default Search;
