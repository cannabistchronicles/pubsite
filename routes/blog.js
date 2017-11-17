var express = require('express')
var router = express.Router()
var BlogManager = require('../controllers/blog.js')();
var path = require('path');
var ejs = require('ejs');
const fs = require('fs');
var bodyParser = require('body-parser');    
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
let upload = require('multer')({ dest: 'files/'});

router.get("/",function(req,res){
    BlogManager.getBlogs(function(blogs) {
    ejsRender('index', {blogs:blogs, recent_post:blogs}, res);
    });
});
router.get("/posts", function(req, res) {
    
    BlogManager.getBlogs(function(blogs) {
    ejsRender('posts', {blogs:blogs}, res);
    }, 10);
})
router.get("/post", function(req, res) {
    if (!req.query.id) {
        res.send("err");
        return;
    }
    BlogManager.getBlog(req.query.id, function(blog) {
        if (blog == null) {
            sendError(400, res);
            return;
        }
        BlogManager.getRandomBlogs(function(blogs) {
            if (blogs === null) blogs = [];
            ejsRender('post', {blog:blog,recent_blog:blogs}, res);

        }.bind(blog));
    });

});
router.get("/publish", function(req,res) {
    ejsRender('publish', {}, res);
});
router.post("/post/delete", function(req,res) {
    if (!req.body.id) {
        sendError(400, res);
    } else {
        BlogManager.deleteBlog(req.body.id, function(err) {
            if (err) {
                sendError(400, res);
                console.log(err);
                return;
            }
            res.send("success")
        });
    }
});
router.post("/publish", upload.fields([{ name: 'mainImg', maxCount: 1 },{ name: 'title', maxCount: 1 }, { name: 'tags', maxCount: 1 }, { name: 'preview', maxCount: 1 }, { name: 'body', maxCount: 1 }, { name: 'category', maxCount: 1 }]), function(req,res) {
    
    if (req.body['title'] == undefined || req.body['tags'] == undefined || req.body['preview'] == undefined || req.body['body'] == undefined || req.body['category'] == undefined) {
        console.log(req.body);
        sendError(400, res);
        res.send("err");   
        return;
    }
    var mainImgSrc = null;
    if (req.files['mainImg'].length > 0) {
        saveImage(req.files['mainImg'][0]);
        mainImgSrc = req.files['mainImg'][0].originalname;
    }
    res.send(BlogManager.createBlog(mainImgSrc, req.body['title'], req.body['preview'], req.body['body'], req.body['tags'].split(','), req.body['category'], req.body['author']));
});
router.use('/js', express.static('client/js'));
router.use('/style', express.static('client/style'));
router.use('/images', express.static('client/images'));
function saveImage(file) {
  var tmp_path = 'files/' + file.filename;
    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var target_path = 'client/images/' + file.originalname;
  
    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { console.log("File Uploaded") });
    src.on('error', function(err) { if (err) throw err});
}
function ejsRender(name, data, res) {
    ejs.renderFile('client/' + name + '.ejs', data, function(err, str) {
        if (err) console.log(err);
        res.send(str);
    });

}
function sendError(code, res) {
    
    res.status(code);
    switch(code) {
        case 400: res.send("err400");
    }
}
module.exports = router;