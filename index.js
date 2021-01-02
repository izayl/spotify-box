require('dotenv').config()

const eaw = require('eastasianwidth')
const { Octokit } = require('@octokit/rest')
const { getTopTracks } = require('./spotify')

const { GH_TOKEN: github_token, GIST_ID: gist_id } = process.env

const octo = new Octokit({
  auth: `token ${github_token}`,
})

async function main() {
  const json = await getTopTracks()
  await updateTopTracks(json)
}

async function updateTopTracks(json) {
  let gist
  try {
    gist = await octo.gists.get({
      gist_id,
    })
  } catch (error) {
    console.error(
      `spotify-box ran into an issue for getting your gist:\n${error}`
    )
  }

  const tracks = json.items.map(item => ({
    name: item.name,
    artist: item.artists.map(artist => artist.name.trim()).join(' & '),
  }))
  if (!tracks.length) return

  const lines = []
  for (let index = 0; index < Math.min(tracks.length, 10); index++) {
    const track = tracks[index]
    const { name, artist } = track
    const line = [
      // truncate(name, 25).padEnd(35),
      // truncate(artist, 15).padStart(5),
      truncate(name, 25).padEnd(35 + name.length - eaw.length(name)),
      truncate(artist, 18).padStart(20 + name.length - eaw.length(name)),
    ]
    lines.push(line.join(''))
  }

  console.log(lines.join('\n'))

  try {
    const filename = Object.keys(gist.data.files)[0]
    await octo.gists.update({
      gist_id,
      files: {
        [filename]: {
          filename: '🎵 Spotify Top Track',
          content: lines.join('\n'),
        },
      },
    })
  } catch (error) {
    console.error(
      `spotify-box ran into an issue for updating your gist:\n${error}`
    )
  }
}

function truncate(str, n) {
  const len = eaw.characterLength(str)
  for (let i = n; i >= 0; i--) {
    if (eaw.length(str) <= n + 2) break
    str = str.substring(0, i)
  }
  return str
}

;(async () => {
  await main()
})()
