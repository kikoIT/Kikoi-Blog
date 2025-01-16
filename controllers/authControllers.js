const User = require('../models/user');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'email is not registerd';
    }
    
     // incorrect password
     if (err.message === 'incorrect password') {
        errors.email = 'password is incorrect';
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'Email already in use';

        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;

        })
    }
    return errors;
}

const createToken = (id) => {
    maxAge = 24 * 60 * 60;
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    });
}

const signup_get = (req, res) => {
    res.render('signup', {title: 'Signup'});
}

const login_get = (req, res) => {
    res.render('login', {title: 'Login'});
}

const signup_post = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: maxAge * 1000 })
        res.status(201).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    }
    catch (err) { 
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post
}