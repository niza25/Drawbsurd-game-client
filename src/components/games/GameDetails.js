import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame, updateGameData } from '../../actions/games'
import { getUsers } from '../../actions/users'
import { userId } from '../../jwt'
import Paper from '@material-ui/core/Paper'
import './GameDetails.css'
import CanvasToDraw from './CanvasToDraw'
import CanvasToDisplay from './CanvasToDisplay'
import Input from './Input'
import Button from '@material-ui/core/Button'

class GameDetails extends PureComponent {

  state = {
    answer: ''
  }

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

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
      <div>
        <Paper className="outer-paper">
          <h1>Drawbsurd Nr {game.id}</h1>
          <p>Your drawbsurd is {game.status}</p>

          {
            game.status === 'started' &&
            player && player.turn === game.turn &&
            <div>
              <div>Draw:<span id='phraseDisplay'> {game.phrase}</span></div>
              <div>Your opponent guesses: <span id='answerDisplay'>{game.answer}</span></div>
            </div>
          }

          {
            game.status === 'started' &&
            player && player.turn !== game.turn &&
            <div>
              <div>You should be guessing! Type your guess:</div>
              <Input onChange={this.onChange}
                answer={this.state.answer}
                onSubmit={this.onSubmit} />
            </div>
          }

          {
            game.status === 'pending' &&
            game.players.map(p => p.userId).indexOf(userId) === -1 &&
            <Button
              onClick={this.joinGame}
              style={{ backgroundColor: '#339966' }}>
              Join this drawbsurd</Button>
          }
        </Paper>
        <Paper className="outer-paper">
          {
            game.status !== 'pending' && player.turn === game.turn &&
            <CanvasToDraw gameId={this.props.match.params.id} />
          }

          {
            game.status !== 'pending' && player.turn !== game.turn &&
            <CanvasToDisplay gameId={this.props.match.params.id} canvasDisplay={game.canvas} />
          }
        </Paper>
      </div>)
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