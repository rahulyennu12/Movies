const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

const convertDbObjectToResponseObject0 = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const movieName = `SELECT movie_name FROM movie;`;
  const movieArray = await db.all(movieName);
  response.send(
    movieArray.map((each) => convertDbObjectToResponseObject(each))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const adding = `INSERT INTO movie (movie_id,director_id,movie_name,lead_actor)
    VALUES ('${directorID}','${movieName}',${leadActor});`;
  const add = await db.run(adding);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, respond) => {
  const { movieId } = request.params;
  const getmovie = `SELECT * FROM movie WHERE movie_id=${movieId};`;
  const mov = await db.get(getmovie);
  response.send(convertDbObjectToResponseObject0(mov));
});

app.put("/movies/:movieId/", async (request, respond) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updating = `UPDATE movie SET 
    director_id='${directorId}',
    movie_name=${movieName},
    lead_actor='${leadActor}'
    WHERE
    movie_id=${movieId};`;

  await db.run(updating);
  respond.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, respond) => {
  const { movieId } = request.params;
  const deleting = `DELETE FROM movie  
    WHERE
    movie_id=${movieId};`;

  await db.run(deleting);
  respond.send("Movie Removed");
});

const convertDbObjectToResponseObject2 = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const dirName = `SELECT * FROM director;`;
  const dirArray = await db.all(dirName);
  response.send(dirArray.map((eac) => convertDbObjectToResponseObject2(eac)));
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorID } = request.params;
  const movName = `SELECT movie_name FROM movie 
    Where director_id=${directorID};`;
  const mvArray = await db.get(mvName);
  response.send(mvArray.map((ea) => convertDbObjectToResponseObject(ea)));
});

module.exports = app;
