import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getGames, joinGame, updateGameData, changeStatus } from '../../actions/games'
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

  calculateWinner = () => {
    const game = this.props.game
    const arrayPhrase = game.phrase.toLowerCase().replace('-','').split(' ')
    const arrayAnswer = game.answer.toLowerCase().replace('-','').split(' ')
    const winnerArray = [];
    arrayPhrase.forEach((e1) => arrayAnswer.forEach((e2) => {
      if (e1 === e2) {
        winnerArray.push(e1)
      }
    }
    ));
    console.log(arrayPhrase, 'arrayPhrase')
    console.log(arrayAnswer, 'arrayAnswer')
    if (winnerArray.length >= 2) {
      this.props.changeStatus(this.props.game.id)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.updateGameData(this.props.game.id, this.state.answer)
    setTimeout(() => {
      this.calculateWinner()
    }, 500
    )
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
          <div>
            <h1>Drawbsurd Nr {game.id}</h1>
            <p>The round has {game.status}</p>
          </div>

          {
            game.status === 'started' &&
            player && player.turn === game.turn &&
            <div>
              <p>Draw:<span className='phraseDisplay'> {game.phrase}</span></p>
              <p>Your opponent guesses: <span id='answerDisplay'>{game.answer}</span></p>
            </div>
          }

          {
            game.status === 'finished' && player &&
            <div>
              <p>We have a winner!</p>
              <p>{game.players
                .map(player => users[player.userId].firstName)[1]} answered: <span className='phraseDisplay'> {this.props.game.answer}</span></p>
            </div>
          }


          {
            game.status === 'started' &&
            player && player.turn !== game.turn &&
            <div>
              <p>What's on the picture? Type your guess:</p>
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
        <div>
          {
            game.status !== 'pending' && game.status !== 'finished' && player.turn === game.turn &&
            <CanvasToDraw gameId={this.props.match.params.id} />
          }

          {
            game.status !== 'pending' && game.status !== 'finished' && player.turn !== game.turn &&
            <CanvasToDisplay gameId={this.props.match.params.id} canvasDisplay={game.canvas} />
          }

          {
            game.status === 'finished' && player &&
            <div>
              <CanvasToDisplay gameId={this.props.match.params.id} canvasDisplay={game.canvas} />

            </div>
          }
        </div>



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
  getGames, getUsers, joinGame, updateGameData, changeStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)