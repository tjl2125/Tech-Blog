// const sequelize = require('../config/connection');
// const { User, Post, Comment } = require('../models');

// const userData = require('./userData.json');
// const postData = require('./postData.json');
// const commentData = require('./commentData.json')

// const seedDatabase = async () => {
//   await sequelize.sync({ force: true });

//   const users = await User.bulkCreate(userData, {
//     individualHooks: true,
//     returning: true,
//   });

//   for (const post of postData) {
//     await Post.create({
//       ...post,
//       user_id: users.id,
//     });
//   }

//   for (const comment of commentData) {
//     await Comment.create({
//       ...comment,
//       user_id: users.id
//     });
//   }

//   process.exit(0);
// };

// seedDatabase();
const seedPosts = require('./postData.json');
const seedUsers = require('./userData.json');
const seedComments = require('./commentData.json');

const sequelize = require('../config/connection');
const User = require('../models/User');
const Post = require ('../models/Post');
const Comment = require ('../models/Comment'); 

const seedAll = async () => {
  await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');
  
  await User.bulkCreate(seedUsers);
    console.log('\n----- USERS SEEDED -----\n');
  
  await Post.bulkCreate(seedPosts);
    console.log('\n----- POSTS SEEDED -----\n');

  await Comment.bulkCreate(seedComments); 
    console.log('\n----- COMMENTS SEEDED -----\n');

  process.exit(0);
};

seedAll();