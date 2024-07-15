var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
methodOverride = require("method-override")
mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded( {extended: true} ) );

var blogSchema = new mongoose.Schema({

    title: String,
    image: String,
    post: String,
    date: {type: Date, default: Date.now}
});

 var blogs = mongoose.model("Blog", blogSchema);


app.get("/", function(req, res){

    res.redirect("/blogs");
});


app.get("/blogs", function(req, res){

    blogs.find({}, function(err, foundBlogs){

        if(err){

            console.log(err);
        }
        else{

            res.render("index", {blogs: foundBlogs} );
        }

    });

});


app.get("/blogs/new", function(req, res){

    res.render("new");
});

app.post("/blogs", function(req, res){

    var newBlog = req.body.blog;


    blogs.create(newBlog, function(err, blog){
        
        if(err){

            console.log(err);
        }
        else {
            console.log("*********************");
            console.log(blog);
           res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){

    var id = req.params.id;

    blogs.findById(id, function(err, foundBlog){

        if(err){
            console.log(err);
        }
        else{
            res.render("show", {blog:foundBlog});
        }

    });

});

app.get("/blogs/:id/edit", function(req, res){

    var id = req.params.id;

    blogs.findById(id, function(err, foundBlog){

        if(err){

            console.log(err);

        }else{
            
            res.render("edit", {blog: foundBlog});
        }
    })
});

app.put("/blogs/:id", function(req, res){

    var id = req.params.id;

    blogs.findByIdAndUpdate(id, req.body.blog, function(err, updatedBlog){
        console.log(updatedBlog);
        if(err){

            console.log(err);

        }else{
            
            res.redirect( "/blogs/" + id );
        }
    });
});

app.delete("/blogs/:id", function(req, res){

    var id = req.params.id;
    
    blogs.findByIdAndRemove(id, function(err){

        if (err){
            
            console.log(err)
        }
        else{

            res.redirect("/blogs");
        }

    });

});


app.listen(8080, function(req, res){

    console.log("blog server has stated");
});

