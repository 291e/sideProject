const axios = require('axios');
const db = require('../../db');
require('dotenv').config();


class movieApiCaller{
  
  async movieInfoApiCaller(){
  let startCount = 8000;
  console.log('movieApiCaller start');
  for (let i = 0; i < 100; i++) {
    const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?ServiceKey=`+ process.env.KMDB_API_KEY +`&collection=kmdb_new2&detail=Y&listCount=1000&startCount=${startCount}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      for (let j = 0; j < 1000; j++) {
        if (response.data?.Data === undefined) {
          console.log('no data '+startCount);
          break;
        }
        const data = response.data?.Data[0].Result[j];
        
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

  async movieInfoApiCallerTop10(title, releaseDts){
    const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?ServiceKey=`+ process.env.KMDB_API_KEY +`&collection=kmdb_new2&detail=Y&title=${title}&releaseDts=${releaseDts}`;
    try {
      const response = await axios.get(url);
      const data = response.data?.Data[0].Result[0];
        
        //movie table
      const movie_id = data.movieSeq;
      const title = data.title.match(/!HS(.*?)!HE/g);
      const combiendtitle = title.map(match => match.replace(/!HS|!HE/g, '').trim()).join(' ');
      console.log(combiendtitle);
      const repRlsDate = data.repRlsDate;
      const rating = data.rating;
      const plot = data.plots.plot[0].plotText;
      const runtime = data.runtime;
      const company = data.company;
      //db insert
      await db.insertMovie([movie_id, combiendtitle, repRlsDate, rating, plot, runtime, company]);

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
        //db insert
        await db.insertKeyword([keyword_id]);
        await db.insertMovieKeyword([movie_id, keyword_id]);
      }
        
    }
    catch (error) {
      console.log(error);
      return 0;
    }
    return 1;
  }
  
  async movieBoxOfficeCaller() {
    const date = new Date();
    const url = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=' + process.env.KOBIS_API_KEY + '&targetDt='+date.getFullYear()+String(date.getMonth()).padStart(2, '0')+(date.getDate()-1);
    const response = await axios.get(url);
    console.log(url);
    console.log(response.data);
    const data = response.data.boxOfficeResult.dailyBoxOfficeList;
    for (let i = 0; i < data.length; i++) {
      const title = data[i].movieNm;
      console.log(title);
      const repRlsDate = data[i].openDt.replace(/-/g, "");
      await this.movieInfoApiCallerTop10(title, repRlsDate);
      const audi = data[i].audiAcc;
      const sales = data[i].salesAcc;
      const rank = data[i].rank;
      const rankInten = data[i].rankInten;
      const rankOldAndNew = data[i].rankOldAndNew;
      const movie_id = await db.selectMovieTitleAndProdYear(title, repRlsDate);
      console.log(movie_id, title, repRlsDate);
      await db.insertBoxOffice([movie_id.movie_id, title, repRlsDate, audi, sales, rank, rankInten, rankOldAndNew]);
    }
    return 1;
  }
}
module.exports = new movieApiCaller;

