const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: [
        'id',
        'title',
        'date_created',
        'post_text',
      ],
      order: [['date_created', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User, 
            attributes: ['username']
          }
        },
      ],
    });
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in,
      userName: req.session.username, 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/post/:id', async (req, res) => {
//   try {
//     const onePost = await Post.findByPk(req.params.id, {
//       attributes: [
//         'id',
//         'post_text',
//         'title',
//         'date_created',
//       ],
//       include: [
//         {
//           model: User,
//           attributes: ['name'],
//         },
//         {
//           model: Comment,
//           attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
//           include: {
//             model: User,
//             attributes: ['username']
//           }
//         },
//       ],
//     });

//     const post = onePost.get({ plain: true });

//     res.render('post', {
//       post,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'date_created',
      'post_text'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
    ]
  })
  .then (postData => {
    if (!postData) {
      res.status(400).json({message: 'No post found with this id'});
      return;
    }
    const post = postData.get({plain: true});

    res.render('single-post', {
      post,
      loggedIn: req.session.loggedIn
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err); 
  })
}); 


router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('signup'); 
}
);

module.exports = router;
