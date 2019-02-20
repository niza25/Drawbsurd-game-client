import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame, updateGameData } from '../../actions/games'
import { getUsers } from '../../actions/users'
import { userId } from '../../jwt'
import Paper from '@material-ui/core/Paper'
// import Board from './Board'
import './GameDetails.css'
import CanvasToDraw from './CanvasToDraw'
import CanvasToDisplay from './CanvasToDisplay'

import Phrase from './InputPhraseBox/Phrase'
import Input from './InputPhraseBox/Input'

const phrases = ['duck robs a bank', 'to be on top of the world', 'cat smokes a cigar', 'to have a snake in pocket', 'monkey having a BBQ', 'wild programmer', 'git hell', 'space battle'];


class GameDetails extends PureComponent {

  state = {
    answer: '',
    phrase: ''
  }

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
    this.setState({
      phrase: phrases[Math.floor(Math.random() * phrases.length)]
    })
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  onDoneHandler = () => {

  }

  onChange = (event) => {
    this.setState({
      answer: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.updateGameData(this.props.game.id, this.state.answer)
    this.setState({
      answer: ''
    })
  }

  render() {

    const { game, users, authenticated, userId } = this.props

    if (!authenticated) return (
      <Redirect to="/login" />
    )

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'


    const player = game.players.find(p => p.userId === userId)

    return (
      <Paper className="outer-paper">
        <h1>Drawbsurd Nr {game.id}</h1>

        <p>Your drawbsurd is {game.status}</p>

        {
          game.status === 'started' &&
          player && player.turn === game.turn &&
          <div>Draw: "{this.state.phrase}"</div>
        }

        {
          game.status === 'started' &&
          player && player.turn !== game.turn &&
          <div>You should be guessing! Type your guess below</div>
        }

        {
          game.status === 'pending' &&
          game.players.map(p => p.userId).indexOf(userId) === -1 &&
          <button onClick={this.joinGame}>Join this drawbsurd</button>
        }

        <hr />

        {
          game.status !== 'pending' && player.turn === game.turn &&
          <CanvasToDraw gameId={this.props.match.params.id} />
        }

        {
          game.status !== 'pending' && player.turn !== game.turn &&
          <CanvasToDisplay gameId={this.props.match.params.id} canvasDisplay={game.canvas} />
        }

        {
          game.status === 'started' &&
          player && player.turn === game.turn &&
          <Phrase onDoneHandler={this.onDoneHandler}
            phrase={this.state.phrase}
            answer={this.props.game.answer} />
        }

        {
          game.status === 'started' &&
          player && player.turn !== game.turn &&
          <Input onChange={this.onChange}
            answer={this.state.answer}
            onSubmit={this.onSubmit} />
        }
      </Paper>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGameData
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)