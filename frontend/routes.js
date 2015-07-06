module.exports = function(app){
    //Homepage
    app.get('/', require('./views/build/index').init);
}
