import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame, updateGame } from '../../actions/games'
import { getUsers } from '../../actions/users'
import { userId } from '../../jwt'
import Paper from '@material-ui/core/Paper'
import Board from './Board'
import './GameDetails.css'
import CanvasToDraw from './canvas'
import Phrase from './InputPhraseBox/Phrase'

class GameDetails extends PureComponent {

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  makeMove = (toRow, toCell) => {
    const { game, updateGame } = this.props

    const board = game.board.map(
      (row, rowIndex) => row.map((cell, cellIndex) => {
        if (rowIndex === toRow && cellIndex === toCell) return game.turn
        else return cell
      })
    )
    updateGame(game.id, board)
  }

  // Iza added, add logic when done drawing
  onDoneHandler = () => {

  }



  render() {
    const { game, users, authenticated, userId } = this.props

    if (!authenticated) return (
      <Redirect to="/login" />
    )

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0]

    return (
      <Paper className="outer-paper">
        <h1>Drawbsurd #{game.id}</h1>

        <p>Your drawbsurd is {game.status}</p>

        {
          game.status === 'started' &&
          player && player.turn === game.turn &&
          <div>You should be drawing! Find your phrase below</div>
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

        {
          winner &&
          <p>Winner: {users[winner].firstName}</p>
        }

        <hr />

        {
          game.status !== 'pending' &&
          //<Board board={game.board} makeMove={this.makeMove} />
          <CanvasToDraw />
        }
        {
          game.status === 'started' &&
          player && player.turn === game.turn &&
          <Phrase onDoneHandler={this.props.onDoneHandler} />
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
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)
