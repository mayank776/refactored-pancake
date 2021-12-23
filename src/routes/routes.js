const express = require("express");

const router = express.Router();

const userAuth = require("../middleware/userAuth")

const { userController, movieController, ratingController } = require("../controllers");

// user api's
router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);

// movie api's
router.post("/movie", userAuth, movieController.addMovie)
router.put("/movie/:movie", userAuth, movieController.updateMovie)
router.delete("/movie/:movie", userAuth, movieController.deleteMovie)
router.get("/movies", movieController.getMovies)

// rating api
router.post("/rating/:movie", userAuth, ratingController.addRating)


// admin api
router.post("/verify/:user", userController.verifedUser)


module.exports = router;
