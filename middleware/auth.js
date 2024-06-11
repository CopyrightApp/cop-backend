module.exports = {
    // If we are auth then we can continue, else we go home
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('http://localhost:3000/login');
      }
    },
}