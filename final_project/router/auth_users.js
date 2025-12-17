const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const SECRET_KEY = "lfdsdkf###22231mkdsfk*pp"

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body

if(!username || !password) {
    return res.status(400).json({ message: "Username and Password are Required" })
}

if(authenticatedUser(username, password)) {
    const token = jwt.sign({username}, SECRET_KEY, { expiresIn: '1h' })

    return res.json({ token }); // send token as json response
} else {
    return res.status(401).json({ message: "Invalid username or password" })
}

//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization.username;
    let isbn = req.params.isbn;
    let review = req.query.review || req.body.review;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/modified successfully" });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
