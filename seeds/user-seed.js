const { User } = require ('../models'); 

const userData = [
    {
        username: "jdoe",
        email: "jdoe@email.com",
        password: "password",
    },
    {
        username: "max2",
        email: "max@email.com",
        password: "password1",
    }, 
    {
        username: "owain",
        email: "owain@email.com",
        password: "password2",
    }
]

const seedUsers = () => {
    User.bulkCreate(userData);
};

module.exports = seedUsers;