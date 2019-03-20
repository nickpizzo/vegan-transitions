exports.typeDefs = `

    type User {
        _id: ID
        firstName: String! 
        lastName: String!
        password: String!
        bio: String
        profileImage: String
        email: String!
        userName: String!
        joinDate: String
        isAdmin: Boolean!
        createdPosts: [Post!]
    }

    type Post {
        _id: ID
        country: String! 
        region: String!
        category: String!
        body: String!
        postDate: String
        published: Boolean!
        postCreator: User!
    }

    type Comment {
        _id: ID
        body: String!
        user: User!
        post: Post!
        createdAt: String!
        updatedAt: String!
    }

    type Token {
        token: String!
    }

    type Query {
        
        getCurrentUser: User

        getUserProfile: User

        getAllUsers: [User]

        profilePage(userName: String!): User

        getAllPosts: [Post]

        getAllComments: [Comment!]!

    }

    type Mutation {

        signupUser(firstName: String!, lastName: String!, email: String!, userName: String!, password: String!): Token

        signinUser(email: String!, password: String!): Token

        editProfile(email: String!, bio: String!): User

        setProfileIMG(email: String!, profileImage: String!): User
        
        changeEmail(currentEmail: String!, newEmail: String!): User

        changePassword(email: String!, password: String!): User

        passwordReset(email: String!): User

        createPost(country: String!, region: String!, category: String!, body: String!): Post

        createComment(postId: ID!, body: String!): Comment!

        removeComment(commentId: ID!): Post!

    }

`;
