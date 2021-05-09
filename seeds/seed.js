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