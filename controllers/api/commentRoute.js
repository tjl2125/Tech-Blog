const router = require('express').Router();
const { Comment, Post, User } = require('../../models');
const withAuth = require('../../utils/auth');

// router.get('/', (req, res) => {
//     Comment.findAll({})
//       .then(commentData => res.json(commentData))
//       .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//       });
// });

router.post('/', withAuth, async (req, res) => {
  try {
    const newComm = await Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
      date_created: req.session.date_created,
    })
      res.status(200).res.json(newComm); 
} catch (err) {
        console.log(err);
        res.status(500).json(err);
  };
});

router.put('/:id'), withAuth, async (req, res) => {
  try {
    const updateComm = await Comment.update(
      {
        comment_text: req.body.comment_text,
      },
      {
        where: {
          id: req.params.id,
        },
      }
      ); 
    res.status(200).json(updateComm);
  } catch (err) {
    res.status(500).json(err); 
  }
}; 

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deleteComment = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    
    res.status(200).json(deleteComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;