import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import "./App.css"
import Logo from "./assets/knight.svg"

export default function App() {
  const [playerName, setPlayerName] = useState("")
  const [playerObj, setPlayerObj] = useState({})
  console.log(playerObj)
  const { register, handleSubmit } = useForm()
  const onSubmit = (devData) => setPlayerName(devData.playerName)

  const fetchData = () => {
    fetch(`https://api.chess.com/pub/player/${playerName}/stats`)
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        setPlayerObj(responseJson)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    fetchData()
  }, [playerName])

  return (
    <div className="wrapper">
      <div className="container">
        <header>
          <h1>Chess Stats</h1>
          <div>
            <img className="themeChange" src={Logo} alt="logo" />
          </div>
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
          {playerObj.id ? (
            <div className="userData">
              <h2>{playerObj.name || "'No Name'"}</h2>
              <div>
                <img
                  className="devAvatar"
                  src={playerObj.avatar_url}
                  alt={playerObj.name}
                />
              </div>
              {playerObj.location && <h3>{playerObj.location}</h3>}
              <h3>Joined: {new Date(playerObj.created_at).toDateString()}</h3>

              <a href={playerObj.html_url} target="_blank">
                @{playerObj.login}
              </a>
              {playerObj.twitter_username && (
                <a
                  href={`https://twitter.com/${playerObj.twitter_username}`}
                  target="_blank"
                >
                  @{playerObj.twitter_username}
                </a>
              )}
              {playerObj.blog && (
                <a href={playerObj.blog} target="_blank">
                  Website
                </a>
              )}
              <h4>Public Repo: {playerObj.public_repos}</h4>
              <h4>Followers: {playerObj.followers}</h4>
              <h4>Following: {playerObj.following}</h4>
            </div>
          ) : (
            <div className="noUser">
              <h2>{playerName ? "No User Found" : "In search of Devs"}</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
