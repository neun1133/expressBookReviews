const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getListBooks = async() => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
}

const getBookByIsbn = async(isbn) => {
    return new Promise((resolve, reject) => {
        let book = books[isbn];
        if(isbn){
            resolve(book);
        } 
    });
}

const getBookByAuth = async(author) => {
    return new Promise((resolve, reject) => {
        if(author){
            const filtered_keys = Object.keys(books).filter((key) => books[key].author === author);
            const result = filtered_keys.map(key => books[key]);
            resolve(result);
        }
        
    });
}

const getBookByTitle = async(title) => {
    return new Promise((resolve, reject) => {
        if(title){
            const filtered_keys = Object.keys(books).filter((key) => books[key].title === title);
            const result = filtered_keys.map(key => books[key]);
            resolve(result);
        }
        
    });
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
//   return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    // res.send(JSON.stringify({books},null,4));
    getListBooks()
        .then((books) =>  res.send(JSON.stringify({books},null,4)))
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    getBookByIsbn(isbn)
        .then((book) =>  {
            if (book === undefined) {
                return res.status(403).json({ message: `Unable to find Book with isbn '${isbn}'.` })
            }
            res.send(books[isbn])
        })
    // res.send(books[isbn])
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    getBookByAuth(author)
        .then((result) =>  {
            if (Object.keys(result).length>0) {
                res.send(result)
            }else{
                return res.status(403).json({ message: `Unable to find books by author '${author}'.` })
            }
    })
    // const filtered_keys = Object.keys(books).filter((key) => books[key].author === author);
    // const result = filtered_keys.map(key => books[key]);
    // res.send(result);
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    getBookByTitle(title)
        .then((result) =>  {
            if (Object.keys(result).length>0) {
                res.send(result)
            }else{
                return res.status(403).json({ message: `Unable to find books by title '${title}'.` })
            }
            
    })
    // const filtered_keys = Object.keys(books).filter((key) => books[key].title === title);
    // const result = filtered_keys.map(key => books[key]);
    // res.send(result);
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
