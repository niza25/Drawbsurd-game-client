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
import Phrase from './InputPhraseBox/Phrase'
import Input from './InputPhraseBox/Input'

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

  getArrays = () => {
    const game = this.props.game
    const arrayPhrase = game.phrase.split(' ')
    const arrayAnswer = game.answer.split(' ')
    const winnerArray = [];
    arrayPhrase.forEach((e1) => arrayAnswer.forEach((e2) =>
    {if (e1 === e2){
      winnerArray.push(e1)
    }
  }
  ));
    return winnerArray;
    } 

  calculateWinner = () => {
    this.getArrays()
    if (this.getArrays().length >= 2) {
      this.props.changeStatus(this.props.game.id)
    }
  }

  // getGuesser = () => {
  //   const player = this.props.game.players.find(p => p.userId === userId)
  //   const opponentName = this.props.users
  //   [this.props.game.players.find(p => p.userId !== userId).userId].firstName
  //   let guesser;
  //   if (player.turn === 'guessing') {
  //     guesser = this.props.users[userId].firstName
  //   } else {
  //     guesser = opponentName
  //   }
  //   return guesser;
  // }
  
// async updateOnSubmit() {
//     this.props.updateGameData(this.props.game.id, this.state.answer)
// }

onSubmit = (event) => {
    event.preventDefault()
    this.props.updateGameData(this.props.game.id, this.state.answer)
    setTimeout(() => {
    this.calculateWinner()
    }, 100
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
      <Paper className="outer-paper">
        <h1>Drawbsurd Nr {game.id}</h1>

        <p>Your drawbsurd is {game.status}</p>

        {
          game.status === 'started' &&
          player && player.turn === game.turn &&
          <div>Draw: {game.phrase}</div>
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
          game.status !== 'pending' && game.status !== 'finished' && player.turn === game.turn &&
          <CanvasToDraw gameId={this.props.match.params.id} />
        }

        {
          game.status !== 'pending' && game.status !== 'finished' && player.turn !== game.turn &&
          <CanvasToDisplay gameId={this.props.match.params.id} canvasDisplay={game.canvas} />
        }

        {
          game.status === 'started' &&
          player && player.turn === game.turn &&
          <Phrase answer={this.props.game.answer} />
        }

        {
          game.status === 'started' &&
          player && player.turn !== game.turn &&
          <Input onChange={this.onChange}
            answer={this.state.answer}
            onSubmit={this.onSubmit} />
        }

        {
          game.status === 'finished' && player && 
          <div><p>We have a winner! <br></br>
            The guesser answered: {this.props.game.answer}
          </p>
          <CanvasToDisplay gameId={this.props.match.params.id} canvasDisplay={game.canvas} />
          
          </div>
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
  getGames, getUsers, joinGame, updateGameData, changeStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)