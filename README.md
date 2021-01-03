<p align='center'>
  <img width="400" src="https://user-images.githubusercontent.com/10740043/103472010-dc4d9c00-4dc2-11eb-88dd-732563d58e2f.png">
  <h3 align="center">spotify-box</h3>
  <p align="center">Update a gist to contain your weekly top tracks on Spotify.</p>
</p>

---
> 📌✨ For more pinned-gist projects like this one, check out: <https://github.com/matchai/awesome-pinned-gists>

## ✨ Inspiration

This code was heavily inspired by [@jacc's music-box](https://github.com/jacc/music-box).

## 🎒 Prep Work

1. Create a new public GitHub Gist (<https://gist.github.com/>)
2. Create a token with the `gist` scope and copy it. (<https://github.com/settings/tokens/new>)
3. Create a Spotify Application and get certified, detail steps you can see below.

<details><summary>Spotify Authorization Steps</summary>
<p>

### 1. Create new Spotify Application

Visit <https://developer.spotify.com/dashboard/applications> login and create a new Application

After create, you will get your Client ID & Client Secret.

Then click `EDIT SETTINGS` Button, add `http://localhost:3000` to Redirect URIs

### 2. Get Authorization Code

Visit following URL after replace `$CLIENT_ID` to yours

```
https://accounts.spotify.com/en/authorize?client_id=$CLIENT_ID&response_type=code&redirect_uri=http:%2F%2Flocalhost:3000&scope=user-read-currently-playing%20user-top-read
```

Agree to this application to access your info, after that your will be redirect to a new page, the url like this: `http://localhost:3000?code=$CODE`

this `$CODE` is your Authorization Code, it will be used to generate access_token at next step.

### 3. Get Access Token

the last step, use the `$CLIENT_ID` and `$CLIENT_SECRET` from step 1, `$CODE` from step 2 to replace the shell command below

```shell
curl -d client_id=$CLIENT_ID -d client_secret=$CLIENT_SECRET -d grant_type=authorization_code -d code=$CODE -d redirect_uri=http://localhost:3000 https://accounts.spotify.com/api/token
```

after run it at your terminal, you'll get your `${REFRESH_TOKEN}`

the output may like this:

```json
{
    "access_token": "BQBi-jz.....yCVzcl",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "AQCBvdy70gtKvnrVIxe...",
    "scope": "user-read-currently-playing user-top-read"
}
```

if the response not return refresh_token, back to step 2 and retry.

</p>
</details>

## 🖥 Project Setup

1. Fork this repo
2. Go to your fork's `Settings` > `Secrets` > `Add a new secret` for each environment secret (below)

## 🤫 Environment Secrets

- **GH_TOKEN:** The GitHub token generated above.
- **SPOTIFY_CLIENT_ID:** The Client ID you got from Spotify Developer Dashboard.
- **SPOTIFY_CLIENT_SECRET:** The Client Secret you got from Spotify Developer Dashboard.
- **SPOTIFY_REFRESH_TOKEN:** The Refresh Token you got from Spotify API.

## 💸 Donations

Feel free to use the GitHub Sponsor button to donate towards my work if you think this project is helpful. 🤗
