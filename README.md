# refactored-pancake

## movie-management

## instructions

- This is a practical test, where you are required to build Backend REST APIs using
  express.js.
- You should use a persistent DBMS of your choice.
- The source code must be hosted on GitHub with a randomly generated repository name.
  You can use GitHub’s suggestion tool to get a name when creating a repository.
- A good understanding of used tools/libraries, clean and explanatory code will attract
  marks.
- Add a README.md file for instructions to set up and test your code.

### Models

- first of all i have created the 3 models required to store the data, they are user Model, movie Model, and rating model.

- User Model

```yaml
{
  username: { type: String, required: true, trim: true },

  phone:
    {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      validate:
        {
          validator: Validator.validatePhone,
          message: "Please enter a valid phone number",
          isAsync: false,
        },
      match: [Validator.phoneRegex, "Please enter a valid phone number"],
    },

  email:
    {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate:
        {
          validator: Validator.validateEmail,
          message: "Please enter a valid email address",
          isAsync: false,
        },
      match: [Validator.emailRegex, "Please enter a valid email address"],
    },

  password: { type: String, required: true, trim: true, minLength: 8 },
  createdAt: { timestamp },
  updatedAt: { timestamp },
}
```

- Movie Model

```yaml
{
  title: { type: String, required: true, trim: true, unique: true },

  genre: [{ type: String, required: true, trim: true }],

  userId: { type: mongoose.Types.ObjectId, required: true, refs: "User" },

  description: { type: String, required: true, trim: true },

  ratings: { type: Number, default: 0 },
  createdAt: { timestamp },
  updatedAt: { timestamp },
}
```

- rating Model (movie rating)

```yaml
{
  movieId: { type: mongoose.Types.ObjectId, required: true, refs: "Movie" },

  reviewedBy: { type: mongoose.Types.ObjectId, required: true, refs: "User" },

  rating: { type: Number, min: 1, max: 10, required: true },

  review: { type: String },

  createdAt: { timestamp },
  updatedAt: { timestamp },
}
```

## User APIs

- Users should be able to register and login using email and password. Login API should return a JWT token. Authorization for all other APIs should be done using this token.

### POST /signup

- Created a user document from request body.
- i have used bcrypt to encrypt the password and hide user's password
- Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like [this](#successful-response-structure)
- Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)

### Authentication

- Make sure all the movie routes are protected.

### Authorisation

- Make sure that only the owner of the movies is able to edit or delete the movie.
- In case of unauthorized access return an appropirate error message.

### POST /login

- Allow an user to login with their email and password.
- On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like [this](#successful-response-structure)
- If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

## Movie APIs

- A logged in user should be able to post movies with basic fields: title, description and genre.
- A logged in user can only update his own movies.
- A logged in user can only delete his own movies.
- A logged in user should be able to see a list of all movies with their respective average ratings.

### POST /movie

- Created a movie document from request body.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful movie creation. Also return the movie document. The response should be a JSON object like [this](#successful-response-structure)
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

### GET /movies

- Returns all movies in the collection that are present. Response example [here](#get-movie-response)
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure)
- If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure)

### PUT /movie/:movie

- Check if the movieId exists.If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
- Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure)
- Also make sure in the response you return the updated movie document.

### DELETE /movie/:movie

- Check if the movieId exists. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
- If the movie document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure)

## Rating API

- A logged in user can rate any movie. Rating done by a user for a movie should only be counted once in the average rating

### POST /rating/:movie

- Add a rating for the movie in ratings collection.
- Check if the movieId exists and is not deleted before adding the rating. Send an error response with appropirate status code like [this](#error-response-structure) if the movie does not exist
- Update the related movie document by increasing its average rating count
- Return the updated movie document with rating data on successful operation. The response body should be in the form of JSON object like [this](#successful-response-structure)

## Response

### Successful Response structure

```yaml
{ status: "Success", data: {} }
```

### Error Response structure

```yaml
{ status: "Failure", message: "" }
```

## Collections

## users

```yaml
{
  {
    username: "mayank",
    phone: 6869676867,
    email: "aqua1@gmail.com",
    password: "$2b$10$0FO4Uh0buEMGd5mPNwKNlO80.VP582Sj3zn1YV3mrEghxYQsVBEvC"
  },
}
```

## movies

```yaml
{
  {
    title: "zombieland",
    genre: ["action", "zombie"],
    description: "who wanna zombies killed in funny way",
    userId: "61c1d8dba8947752b0966245"
  }
}
```

## rating

```yaml
{
  {
    rating : "8"
  }
}
```


## Response examples
### user response
```yaml
{
    status: "Success",
    user: {
        username: "mayank",
        phone: 6869676867,
        email: "aqua1@gmail.com",
        password: "$2b$10$0FO4Uh0buEMGd5mPNwKNlO80.VP582Sj3zn1YV3mrEghxYQsVBEvC",
        _id: "61c21f52e193cbb458851a6b",
        createdAt: "2021-12-21T18:39:14.820Z",
        updatedAt: "2021-12-21T18:39:14.820Z",
    }
}
```

### movie response
```yaml
{
  {
    status: "Success",
    movie: {
        title: "zombieland",
        genre: [
            "action",
            "zombie"
        ],
        userId: "61c1d8dba8947752b0966245",
        description: "who wanna zombies killed in funny way",
        rating: 0,
        _id: "61c223dd8782e06b8154a970",
        createdAt: "2021-12-21T18:58:37.746Z",
        updatedAt: "2021-12-21T18:58:37.746Z",
    }
}
}
```
