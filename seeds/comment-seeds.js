const { Comment } = require ("../models");

const commentData = [
    {
        user_id: 1,
        post_id: 3,
        comment_text: "Please work",
    },
    {
        user_id: 2,
        post_id: 1, 
        comment_text: "For the love of everything work"
    },
    {
        user_id: 3,
        post_id: 2,
        comment_text: "Did it work"
    }
]

const seedComments = () => {
    Comment.bulkCreate(commentData);
};

module.exports = seedComments; 