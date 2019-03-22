const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var generator = require("generate-password");
const axios = require("axios");
const webConfig = require("./../webConfig");
const Post = require("./models/Post");
const User = require("./models/User");
const Comment = require("./models/Comment");
const { transformPosts, transformComments } = require("./helpers/getModels");

const createToken = (user, secret, expiresIn) => {
  const { _id, firstName, email } = user;

  return jwt.sign(
    {
      _id,
      firstName,
      email
    },
    secret,
    { expiresIn }
  );
};

exports.resolvers = {
  Query: {
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ email: currentUser.email });
      return user;
    },

    getUserProfile: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ email: currentUser.email });
      return user;
    },

    getAllUsers: async (root, args, { User }) => {
      const users = await User.find().sort({
        joinDate: "desc"
      });

      return users.map(user => {
        return { ...user._doc, _id: user.id };
      });
    },

    profilePage: async (root, { userName }, { User }) => {
      const profile = await User.findOne({ userName });
      return profile;
    },

    getAllPosts: async (root, args, { User }) => {
      try {
        const posts = await Post.find();

        return posts.map(post => {
          return transformPosts(post);
        });
      } catch (err) {
        throw err;
      }
    },

    getAllComments: async () => {
      try {
        const comments = await Comment.find();
        return comments.map(comment => {
          return transformComments(comment);
        });
      } catch (err) {
        throw err;
      }
    }
  },

  Mutation: {
    signupUser: async (
      root,
      { firstName, lastName, email, userName, password },
      { User }
    ) => {
      const user = await User.findOne({ email, userName });

      if (user) {
        throw new Error("User already exits");
      }

      const newUser = await new User({
        firstName,
        lastName,
        email,
        userName,
        password
      }).save();

      return { token: createToken(newUser, process.env.JWT_SECRET, "1hr") };
    },

    signinUser: async (root, { email, password }, { User }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User Not Found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Password is invalid");
      }

      return { token: createToken(user, process.env.JWT_SECRET, "1hr") };
    },

    editProfile: async (root, { email, bio }, { User }) => {
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { bio } },
        { new: true }
      );

      if (!user) {
        throw new Error("User Not Found");
      }

      return user;
    },

    setProfileIMG: async (root, { email, profileImage }, { User }) => {
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { profileImage } },
        { new: true }
      );

      if (!user) {
        throw new Error("User Not Found");
      }

      return user;
    },

    changeEmail: async (root, { currentEmail, newEmail }, { User }) => {
      const user = await User.findOneAndUpdate(
        { email: currentEmail },
        { $set: { email: newEmail } },
        { new: true }
      );

      if (!user) {
        throw new Error("User Not Found");
      }

      return user;
    },

    changePassword: (root, { email, password }, { User }) => {
      const saltRounds = 10;

      return bcrypt.hash(password, saltRounds).then(async function(hash) {
        const user = await User.findOneAndUpdate(
          { email },
          { $set: { password: hash } },
          { new: true }
        );

        if (!user) {
          throw new Error("User Not Found");
        }

        return user;
      });
    },

    passwordReset: async (root, { email }, { User }) => {
      const saltRounds = 10;
      const generatedPassword = generator.generate({
        length: 10,
        numbers: true
      });

      return bcrypt
        .hash(generatedPassword, saltRounds)
        .then(async function(hash) {
          const user = await User.findOneAndUpdate(
            { email },
            { $set: { password: hash } },
            { new: true }
          );

          if (!user) {
            throw new Error("User Not Found");
          } else {
            const data = {
              email,
              generatedPassword
            };

            axios
              .post(`${webConfig.siteURL}/password-reset`, data)
              .then(function(response) {
                // console.log('Email sent!');
              })
              .catch(function(error) {
                // console.log(error);
              });
          }

          return user;
        });
    },

    createPost: async (
      root,
      { country, region, category, body },
      { currentUser }
    ) => {
      if (!currentUser) {
        throw new Error("Unauthorized");
      }

      const newPost = new Post({
        country,
        region,
        category,
        body,
        postCreator: currentUser._id
      });

      let createdPost;

      try {
        const result = await newPost.save();
        createdPost = transformPosts(result);

        const postOwner = await User.findById(currentUser._id);

        if (!postOwner) {
          throw new Error("There is no user");
        }

        postOwner.createdPosts.push(newPost);
        await postOwner.save();

        return createdPost;
      } catch (error) {
        console.log(error);
      }
    },

    createComment: async (root, { postId, body }, { currentUser, User }) => {
      if (!currentUser) {
        throw new Error("Unauthorized");
      }
      const fetchedPost = await Post.findOne({ _id: postId });
      const comment = new Comment({
        body,
        user: currentUser._id,
        post: fetchedPost
      });

      const result = await comment.save();
      return transformComments(result);
    },

    removeComment: async (root, { commentId }, { currentUser, User }) => {
      if (!currentUser) {
        throw new Error("Unautorized");
      }
      try {
        const comment = await Comment.findById(commentId).populate("post");
        const post = transformPosts(comment.post);
        await Comment.deleteOne({ _id: commentId });
        return post;
      } catch (err) {
        throw err;
      }
    }
  }
};
