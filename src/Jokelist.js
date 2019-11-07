import React, { Component } from "react";
import axios from "axios";
import emoji from "./emoji.png";
import uniqid from "uniqid";
import Joke from "./Joke";
import "./Jokelist.css";
const url = `https://icanhazdadjoke.com/`;

class Jokelist extends Component {
  static defaultProps = {
    numJokes: 10
  };
  constructor(props) {
    super(props);
    this.state = { jokes: [], loading: false };
  }
  persistStorage = () => {
    localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
  };
  componentDidUpdate() {
    this.persistStorage();
  }
  getJokes = async () => {
    let jokes = [];
    while (jokes.length < this.props.numJokes) {
      const res = await axios.get(url, {
        headers: { Accept: "application/json" }
      });
      jokes.push({
        joke: res.data.joke,
        id: uniqid(),
        votes: 0
      });
    }
    const newJokes = [...this.state.jokes, ...jokes];
    this.setState({ jokes: newJokes, loading: false });
  };
  async componentDidMount() {
    let jokes = JSON.parse(localStorage.getItem("jokes"));
    if (jokes) {
      this.setState({ jokes: jokes });
    } else {
      this.getJokes();
    }
  }
  handleClick = () => {
    this.setState({ loading: true });
    this.getJokes();
  };
  handleVote = (id, delta) => {
    const newState = this.state.jokes.map(j =>
      j.id === id ? { joke: j.joke, id: j.id, votes: j.votes + delta } : j
    );
    this.setState({ jokes: newState });
  };
  render() {
    if (this.state.loading) {
      return (
        <div className="spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h2 className="Jokelist-title">Loading</h2>
        </div>
      );
    }
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="Jokelist">
        <div className="Jokelist-sidebar">
          <h1>Dad jokes!</h1>
          <img src={emoji} className="emoji" />
          <button onClick={this.handleClick} className="Jokelist-btn">
            Get new jokes
          </button>
        </div>
        <div className="Jokelist-jokes">
          {jokes.map(j => (
            <Joke
              votes={j.votes}
              joke={j.joke}
              key={j.id}
              id={j.id}
              upVote={() => this.handleVote(j.id, 1)}
              downVote={() => this.handleVote(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Jokelist;
