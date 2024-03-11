const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database("data.db");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve login page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Process login request
app.post("/login.html", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query the database to check user credentials
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
      } else if (row) {
        // If user is authenticated, redirect to success page
        res.redirect("/success.html");
      } else {
        // If authentication fails, redirect to error page
        res.redirect("/error.html");
      }
    }
  );
});

// Serve success page
app.get("/success.html", (req, res) => {
  res.sendFile(__dirname + "/success.html");
});

// Serve error page
app.get("/error.html", (req, res) => {
  res.sendFile(__dirname + "/error.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
