// REQUIRES
const { time } = require("console");
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");



// just like a simple web server like Apache web server
// we are mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/images", express.static("./public/images"));
app.use("/model" , express.static("./public/model"));

// Fixed Header and Footer
app.use("/header", express.static("./app/component/header.html"));
app.use("/footer", express.static("./app/component/footer.html"));

app.get("/", function (req, res) {
  //console.log(process.env);
  // retrieve and send an HTML document from the file system
  let doc = fs.readFileSync("./app/html/homePage.html", "utf8");
  res.send(doc);
});

app.get("/login" , (req, res) => {
  console.log("a");
  let doc = fs.readFileSync("./app/html/loginPage.html", "utf8");
  res.send(doc);
})

app.get("/main" , (req, res) => {
  console.log("b");
  let doc = fs.readFileSync("./app/html/mainPage.html", "utf8");
  res.send(doc);
})
app.get("/search" , (req, res) => {
  console.log("c");
  
  let doc = fs.readFileSync("./app/html/searchPage.html", "utf8");
  res.send(doc);
})

app.get("/notification" , (req, res) => {
  console.log("e");
  let doc = fs.readFileSync("./app/html/notificationPage.html", "utf8");
  res.send(doc);
})

app.get("/upload" , (req, res) => {
  console.log("f");
  let doc = fs.readFileSync("./app/html/uploadPage.html", "utf8");
  res.send(doc);
})

app.get("/profile" , (req, res) => {
  let doc = fs.readFileSync("./app/html/profilePage.html", "utf8");
  res.send(doc);
})

// for resource not found (i.e., 404)
app.use(function (req, res, next) {
  // this could be a separate file too - but you'd have to make sure that you have the path
  // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

// RUN SERVER
let port = 8001;
app.listen(port, function () {
  console.log("Example app listening on port " + port + "!");
});