const {movieModel, ratingModel} = require("../models")

const {validator} = require("../utils")

const addRating = async (req,res) => {
    try{
        let requestBody = req.body;
        let movieId = req.params.movie;
        let userIdFromToken = req.userId;

        if(!validator.isValidObjectId(movieId)){
            return res.status(400).send({status:"Failure", msg:"enter a valid movie id"})
        }

        if(!validator.isValidRequestBody(requestBody)){
            return res.status(400).send({status:"Failure", msg:"enter the rating or review"})
        }

        // whether the movie is present or not
        const movie = await movieModel.findOne({_id:movieId})

        if(!movie){
            return res.status(404).send({status:"Failure", msg:"movie not found"})
        }

        const {rating, review}  = requestBody

        if(!validator.isValid(rating)){
            return res.status(400).send({status:"Failure", msg:"enter the rating between 1 to 10"})
        }

        if(!validator.isValidRating(rating)){
            return res.status(400).send({status:"Failure", msg:"enter the rating between 1 to 10"})
        }

        // total number of users who has given a rating on a particular movie
        const totalUser = await ratingModel.find({movieId: movieId}).count()

        // to check whether the user is giving a new rating or updating the previous one
        const userPrevRating = await ratingModel.findOne({reviewedBy: userIdFromToken, movieId:movieId})

        // if the user has given a rating before and updating now
        if(userPrevRating){
            let oldRating = userPrevRating.rating

            let updatedRating = await ratingModel.findOneAndUpdate({reviewedBy: userIdFromToken, movieId:movieId}, {$set:{rating:rating}}, {new:true})

            // calculating the new average
            let movieRating = ((movie.rating*totalUser)-oldRating+rating)/totalUser

            // updating the new avearge in the movie
            await movieModel.findOneAndUpdate({_id:movieId}, {$set:{rating: movieRating}})

            return res.status(201).send({status:"Success",msg:"existed rating updated", rating:updatedRating})
        }
        
        // user who is logged in and giving a review
        const reviewedBy = userIdFromToken

        const newRating = {movieId, rating, review, reviewedBy}

        const ratingCreated = await ratingModel.create(newRating)

        // calculating the average rating for the movie
        let movieRating = (movie.rating*(totalUser) + rating)/(totalUser+1)

        // updating the new rating
        await movieModel.findOneAndUpdate({_id:movieId}, {$set:{rating: movieRating}})

        res.status(201).send({status:"Success", rating:ratingCreated})

    }catch(err){
        res.status(500).send({status:"Failure", msg:err.message})
    }
}

module.exports = {
    addRating
}