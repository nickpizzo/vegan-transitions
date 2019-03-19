const Post = require("../models/Post");
const User = require("../models/User");

// helper functions for dynamic data relationships, used in resolvers.js

export const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      joinDate: new Date(user._doc.joinDate).toISOString(),
      createdPosts: getPosts.bind(this, user._doc.createdPosts)
    };
  } catch (err) {
    throw err;
  }
};

export const getPosts = async postIds => {
  try {
    const allPosts = await Post.find({ _id: { $in: postIds } });
    return allPosts.map(post => {
      return {
        ...post._doc,
        _id: post.id,
        postDate: new Date(post._doc.postDate).toISOString(),
        postCreator: getUser.bind(this, post.postCreator)
      };
    });
  } catch (err) {
    throw err;
  }
};

export const singlePost = async postId => {
  try {
    const post = await Post.findById(postId);
    return {
      ...post._doc,
      _id: post.id,
      postCreator: getUser.bind(this, post.postCreator)
    };
  } catch (err) {
    throw err;
  }
};
