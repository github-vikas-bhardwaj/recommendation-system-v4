export type Show = {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  premiered: string;
  ended: string | null;
  weight: number;
  image: {
    original: string | null;
  };
  summary: string;
};

export const SHOWS_PAGE_SIZE = 30;
