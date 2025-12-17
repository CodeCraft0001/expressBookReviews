const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" })
  }

  // Add new user
  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User registered successfully" })

//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const booksList = books; // your books object

  // Option 1: Send JSON response (recommended)
  res.json(booksList);

  // Option 2: Send stringified JSON (less common)
  // res.send(JSON.stringify(booksList, null, 4)); // pretty print with indentation

  // Optionally, log the JSON string to console for debugging
  console.log(JSON.stringify(booksList, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn; // get the ISBN from the URL
    let book = books[isbn];  // Use isbn to find the book details and send response

    if(book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" })
    }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let matchedBooks = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchedBooks[key] = books[key];
    }
  })

  if(Object.keys(matchedBooks).length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" })
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let matchedBooks = {};

  Object.keys(books).forEach((key) => {
    if(books[key].title.toLowerCase() === title.toLowerCase()) {
        matchedBooks[key] = books[key];
    }
  })

  if(Object.keys(matchedBooks).length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res.status(404).json({ message: "no such book found" })
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Books not found" })
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

public_users.post('review/:isbn', function (req, res) {
    // const 
})

module.exports.general = public_users;
