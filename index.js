// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = '62d7a87428f39735dd4e'
const clientSecret = 'f7ec6f070d027cce0b4d8b551a9a20799389c3f7'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');
const { tokensToFunction } = require('_path-to-regexp@1.8.0@path-to-regexp');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
    const requestToken = ctx.request.query.code;
    console.log('authorization code:', requestToken);

    const tokenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(`access token: ${accessToken}`);

    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
        }
    });
    console.log(result.data);
    // const name = result.data.name;
    const name = result.data.login;
    console.log('name:', name)

    //获取到响应后跳转到welcome.html页面
    ctx.response.redirect(`/welcome.html?name=${name}`);
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));

app.listen(8081);

