import { stripHtml } from "./format";
import type { Show } from "./types";

const summaries = [
  "<p>A small town is sealed off from the world by a mysterious transparent dome.</p>",
  "<p>An FBI agent and his team investigate unexplained cases in the Pacific Northwest.</p>",
  "<p>A chemistry teacher turns to manufacturing illicit substances after a dire diagnosis.</p>",
  "<p>Noble families vie for control of the mythical land of Westeros.</p>",
  "<p>A group of survivors navigates a post-apocalyptic world overrun by the undead.</p>",
  "<p>Employees undergo a procedure that separates work memories from personal lives.</p>",
  "<p>Two estranged childhood friends reunite and reflect on love, fate, and identity.</p>",
  "<p>A forensic anthropologist helps solve crimes when remains are too decomposed.</p>",
  "<p>A paper company branch manager creates chaos while his team barely stays afloat.</p>",
  "<p>Teenagers uncover dark secrets in a seemingly perfect suburban town.</p>",
];

const genresPool = [
  ["Drama", "Thriller"],
  ["Comedy", "Drama"],
  ["Science-Fiction", "Drama"],
  ["Crime", "Mystery"],
  ["Horror", "Drama"],
  ["Romance", "Drama"],
  ["Action", "Adventure"],
  ["Fantasy", "Drama"],
];

const names = [
  "Under the Dome",
  "Fringe",
  "Breaking Bad",
  "Game of Thrones",
  "The Walking Dead",
  "Severance",
  "Past Lives",
  "Bones",
  "The Office",
  "Riverdale",
  "Stranger Things",
  "The Crown",
  "Black Mirror",
  "Sherlock",
  "Fleabag",
  "The Mandalorian",
  "Westworld",
  "True Detective",
  "Mad Men",
  "The Bear",
  "Succession",
  "The Last of Us",
  "House of the Dragon",
  "Wednesday",
  "Arcane",
  "Dark",
  "Money Heist",
  "Narcos",
  "Peaky Blinders",
  "The Witcher",
  "Better Call Saul",
  "Ozark",
  "Mindhunter",
  "Twin Peaks",
  "Lost",
  "Dexter",
  "Homeland",
  "The Boys",
  "Invincible",
  "Andor",
  "Loki",
  "WandaVision",
  "Hawkeye",
  "Moon Knight",
  "Daredevil",
  "Jessica Jones",
  "The Punisher",
  "Legion",
  "Fargo",
  "Atlanta",
  "Barry",
  "Euphoria",
  "Yellowjackets",
  "The White Lotus",
  "Abbott Elementary",
  "Ted Lasso",
  "Shrinking",
  "Only Murders in the Building",
  "Poker Face",
  "The Morning Show",
];

export const mockShows: Show[] = names.map((name, index) => {
  const id = index + 1;
  const genres = genresPool[index % genresPool.length] ?? ["Drama"];
  const year = 2010 + (index % 14);
  const ended = index % 5 === 0 ? null : `${year + 3}-06-15`;

  return {
    id,
    name: id === 1 ? "Under the Dome" : name,
    type: index % 3 === 0 ? "Animation" : "Scripted",
    language: index % 7 === 0 ? "Korean" : "English",
    genres: id === 1 ? ["Drama", "Science-Fiction", "Thriller"] : genres,
    status: ended ? "Ended" : "Running",
    premiered: id === 1 ? "2013-06-24" : `${year}-03-12`,
    ended: id === 1 ? "2015-09-10" : ended,
    weight: 100 - (index % 40),
    image: {
      original:
        id === 1
          ? "https://static.tvmaze.com/uploads/images/original_untouched/610/1525272.jpg"
          : `https://picsum.photos/seed/show-${id}/400/600`,
    },
    summary:
      id === 1
        ? "<p>Under the Dome is the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome. The town's inhabitants must deal with surviving the post-apocalyptic conditions while searching for answers about the dome, where it came from and if and when it will go away.</p>"
        : (summaries[index % summaries.length] ?? summaries[0]!),
  };
});

export function getShowById(id: number): Show | undefined {
  return mockShows.find((show) => show.id === id);
}

export function searchShows(query: string): Show[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return mockShows;

  return mockShows.filter(
    (show) =>
      show.name.toLowerCase().includes(normalized) ||
      stripHtml(show.summary).toLowerCase().includes(normalized) ||
      show.genres.some((genre) => genre.toLowerCase().includes(normalized)),
  );
}
