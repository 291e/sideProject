"use client";

import { useQuery } from "react-query";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const fetchMovieDetail = async (movieId: string) => {
  const response = await axios.get(`/api/movies/${movieId}`);
  return response.data;
};

const MovieDetail = () => {
  const pathname = usePathname();
  const [movieId, setMovieId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname) {
      const id = pathname.split("/").pop();
      setMovieId(id || null);
    }
  }, [pathname]);

  const { data, error, isLoading } = useQuery(
    ["movieDetail", movieId],
    () => fetchMovieDetail(movieId as string),
    {
      enabled: !!movieId, // movieId가 존재할 때만 쿼리를 실행
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching movie details</div>;

  // data 또는 data.movie가 존재하는지 확인합니다.
  if (!data || !data.movie) {
    return <div>No movie details available</div>;
  }

  return (
    <div className="h-screen p-4">
      <h2 className="text-2xl font-bold text-black">{data.movie.title}</h2>
      <div className="flex flex-col gap-2 my-4">
        <img
          src={data.posters[0]?.poster_url}
          alt={data.movie.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
        <span>개봉일: {data.movie.repRlsDate}</span>
        <span>평점: {data.movie.rating}</span>
        <p>줄거리: {data.movie.plot}</p>
        <span>상영시간: {data.movie.runtime}분</span>
        <span>제작사: {data.movie.company}</span>
      </div>
      <div className="my-4">
        <h3 className="font-semibold">장르</h3>
        <ul>
          {data.genres.map((genre: any, index: number) => (
            <li key={index}>{genre.genre_name}</li>
          ))}
        </ul>
      </div>
      <div className="my-4">
        <h3 className="font-semibold">감독</h3>
        <ul>
          {data.directors.map((director: any, index: number) => (
            <li key={index}>{director.director_name}</li>
          ))}
        </ul>
      </div>
      <div className="my-4">
        <h3 className="font-semibold">배우</h3>
        <ul>
          {data.actors.map((actor: any, index: number) => (
            <li key={index}>{actor.actor_name}</li>
          ))}
        </ul>
      </div>
      <div className="my-4">
        <h3 className="font-semibold">키워드</h3>
        <ul>
          {data.keywords.map((keyword: any, index: number) => (
            <li key={index}>{keyword.keyword_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetail;
