require('dotenv').config()

const eaw = require('eastasianwidth')
const { Octokit } = require('@octokit/rest')
const { getTopTracks } = require('./spotify')

const { GH_TOKEN: github_token, GIST_ID: gist_id } = process.env

const octo = new Octokit({
  auth: `token ${github_token}`,
})

async function main() {
  envCheck()
  const json = await getTopTracks()
  await updateTopTracks(json)
}

async function envCheck() {
  if (!github_token || !gist_id) {
    throw new Error(
      `
        spotify-box ran into an issue for getting your Environment Secrets
        Please make sure you have the following Environment Secrets set:
          GH_TOKEN
          GIST_ID
        For more information, see the README.md: https://github.com/izayl/spotify-box#-environment-secrets
      `
    )
  }
}

async function updateTopTracks(json) {
  let gist
  try {
    gist = await octo.gists.get({
      gist_id,
    })
  } catch (error) {
    console.error(
      `spotify-box ran into an issue for getting your gist ${gist_id}:\n${error}`
    )
    throw error
  }

  const tracks = json.items.map(item => ({
    name: item.name,
    artist: item.artists.map(artist => artist.name.trim()).join(' & '),
  }))
  if (!tracks.length) return

  const lines = []
  for (let index = 0; index < Math.min(tracks.length, 10); index++) {
    let { name, artist } = tracks[index]
    name = truncate(name, 25)
    artist = truncate(artist, 19)

    const line = [
      name.padEnd(34 + name.length - eaw.length(name)),
      artist.padStart(20 + artist.length - eaw.length(artist)),
    ]
    lines.push(line.join(''))
  }

  try {
    const filename = Object.keys(gist.data.files)[0]
    await octo.gists.update({
      gist_id,
      files: {
        [filename]: {
          filename: '🎵 My Spotify Top Tracks',
          content: lines.join('\n'),
        },
      },
    })
  } catch (error) {
    console.error(
      `spotify-box ran into an issue for updating your gist:\n${error}`
    )
    throw error
  }
}

function truncate(str, len) {
  // string longer than `len`
  for (let i = len - 2; i >= 0; i--) {
    if (eaw.length(str) <= len) break
    str = str.substring(0, i)
  }

  return str.trim()
}

;(async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
