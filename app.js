const express = require('express');
const mongoose = require('mongoose');
const lodash = require('lodash')


const port = process.env.PORT || 3000;
const app = express();

const homecontent = "This is the home page content. You can add more content here as needed. This content can be displayed on the home page of your application. feel free to customize it to suit your needs. You can also add more sections or features to the home page as required.";
const aboutcontent = "This is the about page content. You can add more content here as needed. This content can be displayed on the about page of your application. feel free to customize it to suit your needs. You can also add more sections or features to the about page as required.";
const contactcontent = "This is the contact page content. You can add more content here as needed. This content can be displayed on the contact page of your application. feel free to customize it to suit your needs. You can also add more sections or features to the contact page as required.";

const posts = []

function truncate(str) {
    
        return str.substring(0, 30) + '...';
    
}

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view options', { rmWhitespace: true });

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://desertsailor:0307@cluster0.52njkdy.mongodb.net/todolist?appName=Cluster0");
    
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}
async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}
connectToMongoDB()
const blogSchema = new mongoose.Schema({
    blogtitle: { type: String, required: true },
    blogcontent: { type: String, required: true }
});

const Blog = mongoose.model('Blog', blogSchema);

async function allposts() {
  try {
    // 1. Wait for connection
    await connectToMongoDB();
    const posts = await Blog.find({});
    return posts;
  } catch (err) {
    console.dir(err);
  }
}

async function addpost(blogtitle, blogcontent) {
  try {
    // 1. Wait for connection
   
    const post = new Blog({ blogtitle, blogcontent });
    await post.save();
  } catch (err) {
    console.dir(err);
  }
}

app.get('/', async (req, res) => {
  const posts = await allposts();
  res.render('home', { content: homecontent, posts : posts });
});

app.get('/about', async (req, res) => {
  res.render('about', { content: aboutcontent });
});
app.get('/contact', async (req, res) => {
  res.render('contact', { content: contactcontent });
});

app.get('/compose' , (req,res) =>{
    res.render("compose")
})

app.get("/post/:postid", async (req,res) =>{

 var id = req.params.postid
 
 const post = await Blog.findById(id).exec();
 
 res.render("post",{post:post})
 
  

})

app.post('/compose' , async (req,res) =>{
    var blogtitle = req.body.blogtitle
    var blogcontent = req.body.blogcontent
   
    await addpost(blogtitle, blogcontent);
   
    
    res.redirect("/")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
