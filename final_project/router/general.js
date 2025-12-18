const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

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
public_users.get('/', async function (req, res) {
    try {
        // Simulate async operation (e.g., fetching from DB)
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("Books data not found");
                }
            })
        }

        const booksList = await getBooks(); // your books object

  // Option 1: Send JSON response (recommended)
   res.status(200).json(booksList);

  // Option 2: Send stringified JSON (less common)
  // res.send(JSON.stringify(booksList, null, 4)); // pretty print with indentation

  // Optionally, log the JSON string to console for debugging
  console.log(JSON.stringify(booksList, null, 4));
    } catch (err) {
        return res.status(500).json({ message: err });
    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) { // Task 11
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    try {
    const isbn = req.params.isbn; // get the ISBN from the URL
    let book = books[isbn];  // Use isbn to find the book details and send response

    return res.status(200).json(book);
    
    } catch (err) {
        return res.status(404).json({ message: err })
    }
    

 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) { // Task 12
    try {
      const author = req.params.author;
  
      // Fetch all books via Axios (required by rubric)
      const response = await axios.get("http://localhost:5000/");
      const booksData = response.data;
  
      let matchedBooks = {};
  
      Object.keys(booksData).forEach((key) => {
        if (booksData[key].author.toLowerCase() === author.toLowerCase()) {
          matchedBooks[key] = booksData[key];
        }
      });
  
      if (Object.keys(matchedBooks).length > 0) {
        return res.status(200).json(matchedBooks);
      } else {
        return res.status(404).json({ message: "No books found for this author" });
      }
  
    } catch (err) {
      return res.status(500).json({ message: "An error occurred", error: err.toString() });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) { // Task 13
  //Write your code here
  try {
    const title = req.params.title;
    let matchedBooks = {};
  
    Object.keys(books).forEach((key) => {
      if(books[key].title.toLowerCase() === title.toLowerCase()) {
          matchedBooks[key] = books[key];
      }
    })
  
    if(Object.keys(matchedBooks).length > 0) {
      return res.status(200).json(matchedBooks);
    }
  } catch (err) {
    return res.status(404).json({ message: err })
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

public_users.put('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = req.body;
    const username = req.session ? req.session.authorization?.username : 'guest'; // get username from session or set guest

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" })
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
      }

    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review by username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews })

})

public_users.delete("/auth/review/:isbn", (req, res)=> {
    const isbn = req.params.isbn;
    const username = req.session ? req.session.authorization?.username : null;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Books not found" });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found for this user" });
    }
})

module.exports.general = public_users;
