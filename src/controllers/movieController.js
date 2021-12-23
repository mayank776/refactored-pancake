const {userModel, movieModel} = require("../models")

const { validator } = require("../utils");

const addMovie = async (req,res) => {
    try{
        const requestBody = req.body;
        // for authorization storing the userid from token
        const userIdFromToken = req.userId;

        if(!validator.isValidRequestBody(requestBody)){
            return res.status(400).send({status:"Failure", msg:"enter the request body"})
        }

        const {title, genre, description} = requestBody;

        if(!validator.isValid(title)){
            return res.status(400).send({status:"Failure", msg:"enter the movie title"})
        }

        const uniqueTitle = await movieModel.findOne({title:title})

        if(uniqueTitle){
            return res.status(400).send({status:"Failure", msg:`${uniqueTitle.title} is already present. add a new one!`})
        }

        if(!validator.isValid(description)){
            return res.status(400).send({status:"Failure", msg:"enter the movie description"})
        }

        // whether registered user is present
        const user = await userModel.findOne({_id: userIdFromToken, verified:true});
      
        if (!user) {
            return res.status(404).send({ status: "Failure", msg: `user not found` });
        }

        // authorising the user
        if (user._id.toString() !== userIdFromToken) {
            return res.status(403).send({
              status: "Failure",
              msg: `Unauthorized access!`,
            });
        }

        const newMovie = {title, description, userId:userIdFromToken}

        // since genre is an array 
        if(genre) {
            if(validator.isArray(genre)) {
                newMovie['genre'] = [...genre]
            }
            if(validator.isValidString(genre)) {
                newMovie['genre'] = [ genre ]
            }
        }

        const movieCreated = await movieModel.create(newMovie)

        res.status(201).send({status:"Success", movie:movieCreated})

    }catch(err){
        res.status(500).send({status:"Failure", msg:err.message})
    }
    
}

const updateMovie = async (req,res) => {
    try {
        let requestBody = req.body;
        let movieId = req.params.movie;
        let userIdFromToken = req.userId;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(401).send({status: true, msg: "No paramateres passed. movie unmodified", movie: movie});
        }

        if (!validator.isValidObjectId(movieId)) {
        res
            .status(400)
            .send({ status: false, msg: "please enter a valid movie id" });
        return;
        }
        // movie should be present that we want to update
        const movie = await movieModel.findOne({_id: movieId});

        if (!movie) {
            return res.status(404).send({ status: false, msg: `movie not found` });
        }

        // AUTHORIZATION
        if (movie.userId.toString() !== userIdFromToken) {
            return res.status(403).send({status: false, msg: `Unauthorized access! `,});
        }

        const { title, genre, description } = requestBody;

        // creating a updated movie field.
        const updateMovie = {};

        if (validator.isValid(title)) {
            if (!Object.prototype.hasOwnProperty.call(updateMovie, "$set"))
                updateMovie["$set"] = {};

            updateMovie["$set"]["title"] = title;

            let isTitleAlreadyPresent = await movieModel.findOne({title:title,  _id: { $ne: movie._id } })
        
            if (isTitleAlreadyPresent) {
                return res.status(400).send({ status: false, message: `${title} is already present`});
            }
        }

        if(genre) {
            if(!Object.prototype.hasOwnProperty.call(updateMovie, '$set')) updateMovie['$set'] = {}
            
            if(validator.isArray(genre)) {
                updateMovie['$set']['genre'] = [genre]
            }
            if(validator.isValidString(genre)) {
                updateMovie['$set']['genre'] = genre
            }
        }

        if (validator.isValid(description)) {
            if (!Object.prototype.hasOwnProperty.call(updateMovie, "$set"))
                updateMovie["$set"] = {};

                updateMovie["$set"]["description"] = description;
        }

    
        const movieUpdated = await movieModel.findOneAndUpdate({ _id: movieId }, updateMovie, { new: true });

        res.status(200).send({ status: true, msg: "movie updated successfully", movie: movieUpdated });

      } catch (err) {
        res.status(500).send({ status: "failure", msg: err.message });
      }
}

const deleteMovie = async (req,res) => {
    try {
        let movieId = req.params.movie;
        let userIdFromToken = req.userId;
        
        let movie = await movieModel.findOne({ _id: movieId });

        if (!movie) {
          return res.status(404).send({ status: "failure", msg: "movie not found" });
        }

        // user authorization
        if (movie.userId.toString() !== userIdFromToken) {
            return res.status(403).send({status: false, msg: `Unauthorized access!`,});
        }
    
        movie = await movieModel.findByIdAndRemove(movieId);

        res.status(200).send({ status: "Success", msg: "movie deleted" });

      } catch (err) {
        res.status(500).send({ status: "failure", msg: err.message });
      }
}

const getMovies = async (req,res) => {
    try {
        // finding all the movies in the db
        let movies = await movieModel.find({},{ createdAt: 0, updatedAt: 0, __v: 0 });
    
        res.status(200).send({ status: "Success", movieList: movies });
    } catch (err) {
        res.status(500).send({ status: "Failure", msg: err.message });
    }
}

module.exports = {
    addMovie,
    updateMovie,
    deleteMovie,
    getMovies,
}