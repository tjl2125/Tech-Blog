const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// const sequelize =  require ('../../config/connection'); 

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            "id",
            "title",
            "date_created",
            "post_text"
        ], 
        order: [['date_created', 'DESC']],
        include: [
            {
                model: Comment, 
                attributes: ["id", "comment_text", "post_id", "user_id", "date_created"],
                include: {
                    model: User, 
                    attributes: ["username"],
                }
            }, 
        ]
    })
    .then(postData => res.json(postData))
    .catch (err => {
        console.log(err);
        res.status(500).json(err); 
    })
}); 

router.get('/:id', (req,res) => {
    Post.findOne ({
        where: {
            id: req.params.id
        }, 
        attributeS: [
            "id",
            "title",
            "date_created", 
            "post_text"
        ],
        include: [
            {
                model: User, 
                attributes: ["username"]
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "date_creatd"], 
                include: {
                    model: User,
                    attributes: ["username"]
                }
            }
        ]
    })
    .then(postData => {
        if (!postData) {
            res.status(404).json({message: "No post found with this id"});
            return; 
        }
        res.json(postData); 
    })
    .catch (err => {
        console.log(err);
        res.status(500).json(err); 
    })
})

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      post_content: req.body.post_text, 
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, (req, res) => {
    try {
    const postData = Post.update({
        title: req.body.title,
        post_content: req.body.post_content
      },
      {
        where: {
          id: req.params.id
        }
      });
      if (!postData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
      };
  });

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
