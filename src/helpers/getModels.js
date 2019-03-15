const Post = require("../models/Post");
const User = require("../models/User");

// helper functions for dynamic data model relationships, used in resolvers.js

export const getUser = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        password: null,
        joinDate: new Date(user._doc.joinDate).toISOString(),
        createdPosts: getPosts.bind(this, user._doc.createdPosts)
      };
    })
    .catch(err => {
      throw err;
    });
};

export const getPosts = postIds => {
  return Post.find({ _id: { $in: postIds } })
    .then(posts => {
      return posts.map(post => {
        return {
          ...post._doc,
          _id: post.id,
          postDate: new Date(post._doc.postDate).toISOString(),
          postCreator: getUser.bind(this, post.postCreator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};
