import { atom } from 'recoil';

export interface genre {
  id: number;
  name: string;
}

export const genreState = atom<genre[]>({
  key: 'genres',
  default: undefined,
});
