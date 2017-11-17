

var blog_model = require('../models/blog.js');
var await = require('asyncawait/await');
module.exports = BlogManager;


function BlogManager() {

    this.createBlog = function(mainImgSrc, title, preview, body, tags, category, author) {
        var blog = new blog_model();
        blog.title = title;
        blog.preview =  preview;
        blog.body = body;
        blog.tags = tags;
        blog.mainImg = mainImgSrc;
        blog.category = category;
        blog.author = author;
        blog.postdate = (new Date()).getTime();
        blog.save();
        return blog._id;
    }
    this.getBlogs = function(callback, limit = 5) {
        blog_model.find().sort({"_id": -1}).limit(limit).exec(function(err, blogs) {
        var blogArray = [];
        var i = 0;
        blogs.forEach(function(blog) {
            blogArray[i] = getBlogObj(blog);
            i+=1;
        });
        callback(blogArray);
    });
    }
    this.getRandomBlogs = function(callback, num=3) {
        blog_model.findRandom({}, {}, {limit: num}, function(err, blogs) {
            if (err) {
                console.log(err);
                callback(null);
            }
            else {
                var blogArray = [];
                i=0;
                blogs.forEach(function(blog) {
                    blogArray[i] = blog;
                    i+=1;
                });
                callback(blogArray);
            }
          });
    }
    this.deleteBlog = function(id, callback) {
        blog_model.find({_id:id}).remove(function(err) {
            callback(err);
        });
    }
    this.deleteAll = function() {
        blog_model.remove();
    }
    this.getBlog = function(id, callback) {
        blog_model.findById(id, function(err, el) {
            if (err || el == null) {
                console.log(err);callback(null);return;
            }
            callback(getBlogObj(el));
        });
    }
    function getBlogObj(blog) {
        var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November","December"]; 
        var date = new Date(parseInt(blog.postdate));
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return {id:blog._id, main_img:blog.mainImg,title:blog.title, preview:blog.preview,body:blog.body, tags:blog.tags, category:blog.category, author:blog.author, post_date:(day + ' ' + monthNames[monthIndex] + ' ' + year)};
    }
    return this;
}