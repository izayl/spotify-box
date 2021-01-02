require('dotenv').config()

const { stringify } = require('querystring')
const fetch = require('node-fetch')

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

const EndpointGetToken = 'https://accounts.spotify.com/api/token'
const EndpointGetTopTopTracks = 'https://api.spotify.com/v1/me/top/tracks'

const getAccessToken = async () => {
  const resp = await fetch(EndpointGetToken, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })
  return resp.json()
}
const getTopTracks = async () => {
  const { access_token } = await getAccessToken()

  return fetch(EndpointGetTopTopTracks, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

;(async () => {
  const resp = await getTopTracks()
  const data = await resp.json()
  console.log(data)
})()
