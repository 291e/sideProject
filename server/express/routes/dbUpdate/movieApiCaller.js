const axios = require('axios');
const db = require('../../db');
require('dotenv').config();



async function movieApiCaller(){
  let startCount = 0;
  console.log('movieApiCaller start');
  for (let i = 0; i < 1; i++) {
    const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?ServiceKey=`+ process.env.KMDB_API_KEY + `&collection=kmdb_new2&detail=Y&listCount=1&startCount=${startCount}`;
    console.log(url);
    try {
      const response = await axios.get(url,{ timeout: 5000 });
      console.log(response.data.Data);
      for (let j = 0; j < 1; j++) {
        const data = response.data?.Data[0].Result[j];
        console.log(data);
        //movie table
        const movie_id = data.movieSeq;
        const title = data.title;
        const repRlsDate = data.repRlsDate;
        const rating = data.rating;
        const plot = data.plots.plot[0].plotText;
        const runtime = data.runtime;
        const company = data.company;
        //db insert
        await db.insertMovie([movie_id, title, repRlsDate, rating, plot, runtime, company]);

        //genre table
        const genre = data.genre.split(',');
        //db insert
        for (let k = 0; k < genre.length; k++) {
          const genre_id = genre[k];
          await db.insertGenre([genre_id]);
          await db.insertMovieGenre([movie_id, genre_id]);
        }

        //director table
        for (let k = 0; k < data.directors.director.length; k++) {
          const director = data.directors.director[k];
          const director_id = director.directorId;
          const director_name = director.directorNm;
          //db insert
          await db.insertDirector([director_id, director_name]);
          await db.insertMovieDirector([movie_id, director_id]);
        }

        //actor table
        for (let k = 0; k < data.actors.actor.length; k++) {
          const actor = data.actors.actor[k];
          const actor_id = actor.actorId;
          const actor_name = actor.actorNm;
          //db insert
          await db.insertActor([actor_id, actor_name]);
          await db.insertMovieActor([movie_id, actor_id]);
        }

        //poster table
        const poster = data.posters.split('|');
        //db insert
        for (let k = 0; k < poster.length; k++) {
          if (poster[k] === '') continue;
          await db.insertPoster([movie_id, poster[k]]);
        }
        //keyword table
        const keyword = data.keywords.split(',');
        for (let k = 0; k < keyword.length; k++) {
          if (keyword[k] === '') continue;
          const keyword_id = keyword[k];
          console.log(keyword_id);
          //db insert
          await db.insertKeyword([keyword_id]);
          await db.insertMovieKeyword([movie_id, keyword_id]);
        }
        
      }
    } catch (error) {
      console.log(error);
      return error;
    }
    startCount += 1000;
  }
  console.log('movieApiCaller end');
  return 1;
}

module.exports = movieApiCaller;

