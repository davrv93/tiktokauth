import express from 'express';

import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cookieParser());
app.use(cors());
app.listen(process.env.PORT || 5000);

const CLIENT_KEY = 'awtfqqxrml4ih11d' // this value can be found in app's developer portal

app.get('/oauth', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    let url = 'https://www.tiktok.com/auth/authorize/';

    url += '?client_key={CLIENT_KEY}';
    url += '&scope=user.info.basic,video.list';
    url += '&response_type=code';
    url += '&redirect_uri={SERVER_ENDPOINT_REDIRECT}';
    url += '&state=' + csrfState;

    res.redirect(url);
})
