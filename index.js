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

    url += '?client_key=awtfqqxrml4ih11d';
    url += '&scope=user.info.basic,video.list';
    url += '&response_type=code';
    url += '&redirect_uri=https://davrv93.github.io/tiktokauth/oauth';
    url += '&state=' + csrfState;

    res.redirect(url);
})


app.get('/callback', async (req, res) => {


    if (!validateCsrfToken(req.query.state)) {
        throw new Error("invalid csrf token");
    }

    async function getAccessTokenAndOpenId(code, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET) {
        let urlAccessToken = 'https://open-api.tiktok.com/oauth/access_token/';
        urlAccessToken += '?client_key=' + TIKTOK_CLIENT_KEY;
        urlAccessToken += '&client_secret=' + TIKTOK_CLIENT_SECRET;
        urlAccessToken += '&code=' + code;
        urlAccessToken += '&grant_type=authorization_code';
        const resp = await axios.post(urlAccessToken);
        return {
            accessToken: resp.data.data.access_token,
            openId: resp.data.data.open_id,
        };
    }

    const code = req.query.code;
    const { openId, accessToken } = await getAccessTokenAndOpenId(code, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET);

})
