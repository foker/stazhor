

module.exports =  function (req, res, next) {
    if (!req.session.user) {
        console.log('error on checkauth')
        return next(true);
    }
    next();
};