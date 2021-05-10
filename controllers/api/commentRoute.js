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
  if (req.session) {
    const newComm = await Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
      date_created: req.session.date_created,
    })
      res.status(200).res.json(newComm); 
  } 
} catch (err) {
        console.log(err);
        res.status(500).json(err);
  };
});

router.put('/:id'), withAuth, async (req, res) => {
  try {
    const upComm = await Comment.create(req.body); 
    res.status(200).json(upComm);
  } catch (err) {
    res.status(500).json(err); 
  }
}; 

router.delete('/:id', withAuth, async (req, res) => {
  try {
    await Comment.destroy({
        where: {
          id: req.params.id
        }
      })
        then(commentData => {
          if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
          }
          res.status(200).res.json(commentData);
        })
      } catch(err) {
          console.log(err);
          res.status(500).json(err);
        };
});

module.exports = router;