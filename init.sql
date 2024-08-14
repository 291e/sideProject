/c postgres

CREATE DATABASE member;

\c member

CREATE TABLE IF NOT EXISTS member (
    member_id SERIAL, 
    name TEXT, 
    id TEXT PRIMARY KEY, 
    password TEXT
);

CREATE TABLE IF NOT EXISTS post (
    post_id SERIAL PRIMARY KEY, 
    title TEXT, 
    content TEXT, 
    id TEXT REFERENCES member(id)
);

CREATE TABLE IF NOT EXISTS comment (
    comment_id SERIAL PRIMARY KEY, 
    comment TEXT, 
    post_id INT REFERENCES post(post_id), 
    id TEXT REFERENCES member(id)
);

CREATE TABLE IF NOT EXISTS like (
    post_id INT REFERENCES post(post_id), 
    id TEXT REFERENCES member(id), 
    PRIMARY KEY(post_id, id)
);

CREATE TABLE IF NOT EXISTS follow (
    follow_id SERIAL PRIMARY KEY, 
    follower TEXT REFERENCES member(id), 
    following TEXT REFERENCES member(id)
);

CREATE TABLE IF NOT EXISTS movie(
    movie_id TEXT PRIMARY KEY, 
    title TEXT, 
    repRlsDate INT, 
    rating TEXT, 
    plot TEXT, 
    runtime TEXT, 
    company TEXT
);

CREATE TABLE IF NOT EXISTS director (
    director_id TEXT PRIMARY KEY, 
    director_name TEXT
);

CREATE TABLE IF NOT EXISTS actor (
    actor_id TEXT PRIMARY KEY, 
    actor_name TEXT
);

CREATE TABLE IF NOT EXISTS genre (
    genre_id SERIAL PRIMARY KEY, 
    genre_name TEXT
);

CREATE TABLE IF NOT EXISTS keyword (
    keyword_id SERIAL PRIMARY KEY, 
    keyword_name TEXT
);

CREATE TABLE IF NOT EXISTS poster(
    poster_id SERIAL PRIMARY KEY, 
    movie_id TEXT REFERENCES movie(movie_id), 
    poster_url TEXT
);

CREATE TABLE IF NOT EXISTS movieDirector (
    movie_id TEXT REFERENCES movie(movie_id), 
    director_id TEXT REFERENCES director(director_id), 
    PRIMARY KEY(movie_id, director_id)
);

CREATE TABLE IF NOT EXISTS movieActor (
    movie_id TEXT REFERENCES movie(movie_id), 
    actor_id TEXT REFERENCES actor(actor_id), 
    PRIMARY KEY(movie_id, actor_id)
);

CREATE TABLE IF NOT EXISTS movieGenre (
    movie_id TEXT REFERENCES movie(movie_id), 
    genre_id TEXT REFERENCES genre(genre_name), 
    PRIMARY KEY(movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS movieKeyword (
    movie_id TEXT REFERENCES movie(movie_id), 
    keyword_id INT REFERENCES keyword(keyword_id), 
    PRIMARY KEY(movie_id, keyword_id)
);

CREATE TABLE IF NOT EXISTS movieReview (
    review_id SERIAL PRIMARY KEY, 
    movie_id TEXT REFERENCES movie(movie_id), 
    id TEXT REFERENCES member(id), 
    rating INT, 
    review TEXT
);