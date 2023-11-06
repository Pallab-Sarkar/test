# Assignment



## Getting started

```
git clone https://github.com/pallab12/Assignment01.git

```

## How to run in local server?

Follow below steps-
(Make sure you have updated node & mongodb installed in your pc)
then,

```
npm install
npm run dev

```
create .env file,
add below keys into .env file-
- DB_URL= mongodb://0.0.0.0:27017/assignment
- PORT= 8000
- NODE_ENV= development
- API_SECRET= efghij

## How can you test in POSTMAN?
I have pushed postman collection in this repository.
you have to import it in the postman, you'll find the import option in top-left corner in Postman
Strictly follow the below steps to test the apis,

- First, you have to create user using this api, POST "BASEURL/api/auth/register"
- You'll receive the OTP in your email (check spam if it's not inside inbox)
- Then, verify user using this api, POST "BASEURL/api/auth/verify-otp"
- Then, Get authorize token, POST "BASEURL/api/auth/login"
- Then, Create book, POST "BASEURL/api/books/create"
- For retrieve all books, POST "BASEURL/api/books/getAll" (Remember you can fetch through giving valid conditions, pagination & searchTerm)
- (ID = Book id)
- For retrieve single book, GET "BASEURL/api/books/:ID"
- For Update book, PUT "BASEURL/api/books/:ID"
- For delete book, DELETE "BASEURL/api/books/:ID"
- (BASEURL = your localhost url)


## Technology used

- Express.js
- Mongoose
- Json web token
- Winston
- Nodemailer
- And, various other packages i have used in this project.

## What things have I implemented?

I have implemented everything mentioned in the document.

