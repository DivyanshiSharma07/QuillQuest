
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "🌟✨ Welcome to My blog! Where dreams come alive and stories unfold ✨🌟This is a whimsical corner of the internet where cuteness reigns supreme. Here, I celebrate all things adorable, from fluffy creatures to heartwarming tales that bring a smile to your face. 🐾💖Step into our enchanting world, where each page is filled with joy, inspiration, and a dash of magic. ✨📚 Join me on a delightful journey as we explore the art of finding beauty in the little things and cherishing the moments that make life truly special. 🌸🌈🌼";
const aboutContent = "🌟✨ Welcome to my cozy corner of the internet! ✨🌟 I'm delighted to have you here, where I pour my heart and soul into sharing my thoughts, experiences, and adventures with you. 📝💭🌄Who am I? 🌸 I'm a dreamer, an explorer, and a lover of all things beautiful and heartfelt. 💫🌿 Through my blog posts, I invite you to join me on a journey of self-discovery, inspiration, and personal growth. 🚀🌱🌟This is a space where I express my thoughts, reflect on life's wonders, and embrace the little moments that make life truly meaningful. 🌈💖✨Here, I aim to create a warm and welcoming haven, a place where we can connect on a deeper level. 🏡🌺💕 Together, we'll navigate the twists and turns of life, finding solace in shared experiences and gaining insights that resonate with our souls. 🌟💫🌿So grab a cup of tea ☕, get cozy, and let's embark on this enchanting journey together! 🌟✨🌸.";
const contactContent = "🌟✨ Hello there! 🌸💬 I'm thrilled that you'd like to reach out and connect. Whether you have a question, a suggestion, or simply want to share your thoughts, I'm here and eager to hear from you. 📩💌 Feel free to reach out using any of the methods below, and I promise to respond as soon as possible. ✉️📱🌈";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect("mongodb://127.0.0.1:27017/blogpostDB", mongooseOptions);

const blogsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog", blogsSchema);

app.get("/", async function (req, res) {
  try {
    const blogs = await Blog.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: blogs
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  const { postTitle, postBody } = req.body;

  try {
    const newBlog = new Blog({
      title: postTitle,
      content: postBody
    });

    await newBlog.save();
    console.log("New blog post added successfully.");
    res.redirect("/");
  } catch (error) {
    console.error("Error adding new blog post:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/posts/:postName", async function(req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  try {
    const foundBlog = await Blog.findOne({ title: requestedTitle });

    if (foundBlog) {
      res.render("post", {
        requestedTitle: foundBlog.title,
        storedContent: foundBlog.content
      });
    } else {
      console.log("No matching blog post found.");
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error finding blog post:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});

