const proxy=require('http-proxy-middleware');

module.exports = fuction(app){
    app.use(proxy('/api',{target:'http://localhost:5000'}));
}; 