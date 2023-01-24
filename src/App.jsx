import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import "./App.css"

export default function App() {
  const [playerName, setPlayerName] = useState("")
  const [playerObj, setPlayerObj] = useState({})
  const [playerStats, setPlayerStats] = useState({})
  const { register, handleSubmit } = useForm()
  const onSubmit = (playerData) => setPlayerName(playerData.playerName)

  const fetchData = () => {
    fetch(`https://api.chess.com/pub/player/${playerName}`)
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        setPlayerObj(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })

    fetch(`https://api.chess.com/pub/player/${playerName}/stats`)
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        setPlayerStats(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    fetchData()
  }, [playerName])

  const highestRating = () => {
    let highest = 0
    for (let i in playerStats) {
      for (let j in playerStats[i].best) {
        if (playerStats[i].best.rating > highest) {
          highest = playerStats[i].best.rating
        }
      }
    }
    return highest
  }
  const wins = () => {
    let wins = 0
    for (let i in playerStats) {
      for (let j in playerStats[i].record) {
        if (playerStats[i].record) {
          wins += playerStats[i].record.win
        }
      }
    }
    return wins
  }
  const draw = () => {
    let draw = 0
    for (let i in playerStats) {
      for (let j in playerStats[i].record) {
        if (playerStats[i].record) {
          draw += playerStats[i].record.draw
        }
      }
    }
    return draw
  }
  const loss = () => {
    let loss = 0
    for (let i in playerStats) {
      for (let j in playerStats[i].record) {
        if (playerStats[i].record) {
          loss = playerStats[i].record.loss
        }
      }
    }
    return loss
  }

  return (
    <div className="wrapper">
      <div className="container">
        <header>
          <h1>Chess Stats</h1>
        </header>
        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Start Typing..."
              {...register("playerName", {
                required: true,
              })}
            />
            <div className="bgSubmit">
              <button className="submitBtn" type="submit">
                Check
              </button>
            </div>
          </form>
          {playerObj.player_id ? (
            <div className="userData">
              <div>
                <div className="player-name">
                  {playerObj.title && (
                    <span className="title"> {playerObj.title} &nbsp;</span>
                  )}
                  <span>{playerObj.name || "No Name"}</span>
                  {playerObj.verified && <span> &nbsp;✔️</span>}
                </div>
                <div>
                  {playerObj.avatar && (
                    <img
                      className="devAvatar"
                      src={playerObj.avatar}
                      alt={playerObj.name}
                    />
                  )}
                </div>
              </div>
              <div>
                {playerObj.url && (
                  <a href={playerObj.url} target="_blank">
                    @{playerObj.username} &nbsp;
                  </a>
                )}

                {playerObj.is_streamer && (
                  <a href={playerObj.twitch_url} target="_blank">
                    @Twitch
                  </a>
                )}
              </div>

              <h4>Followers: {playerObj.followers}</h4>
              <h4 className="highest-rating">
                Highest Rating: {highestRating()}
              </h4>
              <div className="scores">
                <span className="color-green">Wins: {wins()}</span>
                <span className="color-white">Draw: {draw()}</span>
                <span className="color-red">Loss:{loss()}</span>
              </div>
            </div>
          ) : (
            <div className="noUser">
              <h2>
                {playerName ? (
                  <div class="loader">
                    <div class="chess-icon"></div>
                  </div>
                ) : (
                  "Life is like Chess"
                )}
              </h2>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
