const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// @desc Auth with Google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google auth callback
// @route GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: "http://localhost:3000/login"}),
    (req, res) => {
        // Generar el token JWT
        const payload = {
          user: req.user
        };
        const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });
    
        // Configurar la cookie con el token
        res.cookie('jwtToken', token, { httpOnly: false, secure: false }); 
        res.redirect('http://localhost:3000/checker');
      }
  );

// @desc     Logout user
// @route    /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});
module.exports = router;