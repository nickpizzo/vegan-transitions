const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var generator = require("generate-password");
const axios = require("axios");
const webConfig = require("./../webConfig");
const Post = require("./models/Post");

const createToken = (user, secret, expiresIn) => {
  const { firstName, email } = user;

  return jwt.sign(
    {
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
      console.log(user.id);
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
      const posts = await Post.find().populate("postCreator");

      return posts.map(post => {
        return {
          ...post._doc,
          _id: post.id,
          postCreator: {
            ...post._doc.postCreator._doc,
            _id: post._doc.postCreator.id
          }
        };
      });
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
        throw new Error("inValid password");
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
      { country, region, category, body, postCreator },
      { User }
    ) => {
      const newPost = new Post({
        country,
        region,
        category,
        body,
        postCreator
      });

      let createdPost;

      try {
        const result = await newPost.save();
        createdPost = {
          ...result._doc,
          _id: result._doc._id.toString(),
          postCreator: User.bind(this, result._doc.postCreator)
        };

        const postOwner = await User.findById("5c8a8d3ab24b93369ab22ab9");

        if (!postOwner) {
          throw new Error("There is no user");
        }

        postOwner.createdPosts.push(newPost);
        await postOwner.save();

        return createdPost;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
