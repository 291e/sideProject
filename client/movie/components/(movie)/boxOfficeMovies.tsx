"use client";

import { useQuery } from "react-query";
import axios from "axios";
import Link from "next/link";

const fetchBoxOfficeMovies = async () => {
  const response = await axios.get("/api/movies");
  return response.data;
};

const BoxOfficeMovies = () => {
  const { data, error, isLoading } = useQuery(
    "boxOfficeMovies",
    fetchBoxOfficeMovies
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching box office movies</div>;

  return (
    <div className="h-screen flex flex-col p-4">
      <h2 className="text-2xl font-bold text-black">박스오피스 영화</h2>
      <ul className="text-black grid grid-cols-3 gap-4">
        {data.map((movie: any) => (
          <li
            key={movie.movie_id}
            className="aspect-1 bg-neutral-100 rounded-xl p-4 "
          >
            <Link href={`/movie/${movie.movie_id}`}>
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">{movie.title}</span>
                  <div className="border-[1px] rounded-md" />
                  <span className="text-sm">개봉일: {movie.repRlsDate}</span>
                  <span className="text-sm">관객수: {movie.audi}</span>
                  <span className="text-sm">매출액: {movie.sales}</span>
                  <span className="text-sm">
                    순위: {movie.rank} ({movie.rankInten}위 변화)
                  </span>
                  <span className="text-sm">
                    {movie.rankOldAndNew === "NEW"
                      ? "새로운 영화"
                      : "기존 영화"}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoxOfficeMovies;
