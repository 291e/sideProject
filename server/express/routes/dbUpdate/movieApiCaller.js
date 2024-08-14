import axios from 'axios';
import dotenv from 'dotenv';
import db from '../../db';
dotenv.config();


const movieApiCaller = async () => {
  let startCount = 0;
  for (let i = 0; i <= 100; i++) {
    const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?ServiceKey=`+ process.env.KMDB_API_KEY + `&collection=kmdb_new2&detail=Y&listCount=1000&startCount=${startCount}`;
    try {
      const response = await axios.get(url);
      for (let j = 0; j < 1000; j++) {
        const data = response.data?.Data.Result[j];
        
        //movie table
        const movie_id = data.movieSeq;
        const title = data.title;
        const repRlsDate = data.repRlsDate;
        const rating = data.rating;
        const plot = data.plot;
        const runtime = data.runtime;
        const company = data.company;
        //db insert
        db.insertMovie([movie_id, title, repRlsDate, rating, plot, runtime, company]);

        //genre table
        const genre = data.genre.split(',');
        //db insert
        for (let k = 0; k < genre.length; k++) {
          const genre_id = genre[k];
          db.insertGenre([genre_id]);
          db.insertMovieGenre([movie_id, genre_id]);
        }

        //director table
        for (let k = 0; k < data.directors.director.length; k++) {
          const director = data.directors.director[k];
          const director_id = director.directorId;
          const director_name = director.directorNm;
          //db insert
          db.insertDirector([director_id, director_name]);
          db.insertMovieDirector([movie_id, director_id]);
        }

        //actor table
        for (let k = 0; k < data.actors.actor.length; k++) {
          const actor = data.actors.actor[k];
          const actor_id = actor.actorId;
          const actor_name = actor.actorNm;
          //db insert
          db.insertActor([actor_id, actor_name]);
          db.insertMovieActor([movie_id, actor_id]);
        }

        //poster table
        for (let k = 0; k < data.posters.poster.length; k++) {
          const poster = data.posters[k];
          //db insert
          db.insertPoster([movie_id, poster]);
        }
        //keyword table
        const keyword = data.keywords.split(',');
        for (let k = 0; k < keyword.length; k++) {
          const keyword_id = keyword[k];
          //db insert
          db.insertKeyword([keyword_id]);
          db.insertMovieKeyword([movie_id, keyword_id]);
        }
        
      }

    } catch (error) {
      
    }
    startCount += 1000;
  }
}

