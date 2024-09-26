import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 0 5%;
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 20px;
`;

const SearchBox = styled.form`
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

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get('query');

  const { register, handleSubmit } = useForm<{ query: string }>();

  const onValidSubmit: SubmitHandler<{ query: string }> = (data) => {
    console.log(data);
  };
  const onInvalidSubmit: SubmitErrorHandler<{ query: string }> = (error) => {
    console.log('에러');
    console.log(error);
  };
  return (
    <Wrapper>
      <SearchBox onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <SearchInput
          {...register('query', { minLength: 1 })}
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
      </SearchBox>
    </Wrapper>
  );
};

export default Search;
