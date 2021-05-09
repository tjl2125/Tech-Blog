const { Post } = require ('../models'); 

const postData = [
    {
        title: "Title Example 1",
        post_text: "Testing for Example 1",
        user_id: 1
    },
    {
        title: "Title Example 2",
        post_text: "Example 2 testing of post text",
        user_id: 2
    },
    {
        title: "Title Example 3",
        post_text: "The test for Example 3",
        user_id: 3
    }

]

const seedPosts = () => {
    Post.bulkCreate(postData);
};

module.exports = seedPosts; 