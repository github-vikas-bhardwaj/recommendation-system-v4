import { getShowImageSrc, toDateString } from "./format";
import type { Show } from "./types";

export type ShowRow = {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[] | null;
  status: string;
  premiered: string | null;
  ended: string | null;
  weight: number;
  image: string | null;
  summary: string;
};

export function mapShowRow(row: ShowRow): Show {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    language: row.language,
    genres: row.genres ?? [],
    status: row.status,
    premiered: toDateString(row.premiered) ?? "",
    ended: toDateString(row.ended),
    weight: row.weight,
    image: { original: getShowImageSrc(row.image) },
    summary: row.summary,
  };
}
