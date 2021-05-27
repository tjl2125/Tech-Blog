const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require ('../../utils/auth'); 
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store); 

router.get('/', async (req, res) => {
  User.findAll( {
    attributes: {exclude: ['password']}
  })
  .then (userData => res.json(userData))
  .catch (err => {
    console.log(err);
    res.status(500).json(err); 
  })
});

router.get('/:id', async (req, res) => {
  User.findOne( {
    attributes: {exclude: ['password']},
    where: {
      id: req.params.id
    },  
  include: [
    {
      model: Post, 
      attributes: ["id", "title", "post_text", "date_created"]
    },
    {
      model: Comment, 
      attributes: ["id", "comment_text", "date_created"],
      include: {
        model: Post,
        attributes: ["title"]
      }
    }
  ]
  })
  .then (singleUser => {
    if (!singleUser) {
      res.status(400).json ({message: "No user found with this id"});
      return;
    }
    res.json(singleUser);
  })
  .catch (err => {
    console.log (err);
    res.status(500).json(err); 
  })
})

router.post('/', async (req, res) => {
  try {
    const userData = await User.create({ //req.body
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username; 
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {

  await User.findOne({ 
      where: { 
        email: req.body.email 
      } 
    })
    .then(userData => {
    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username; 
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', withAuth, (req, res) => {

  User.update(req.body, {

      individualHooks: true,

      where: {
          id: req.params.id
      }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
})

router.delete('/:id', withAuth, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
