import React, { PureComponent } from 'react'
import CanvasDraw from "react-canvas-draw";
import { updateGameData } from '../../actions/games'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { CirclePicker } from 'react-color';
import './CanvasToDraw.css'

class CanvasToDraw extends PureComponent {

  state = {
    color: '#660066',
    brushRadius: 2,
    background: '#660066'
  }

  handleChangeComplete = (color) => {
    this.setState({
      background: color.hex,
      color: color.hex
    });
  };

  saveDrawing = () => {
    localStorage.setItem(
      "savedDrawing",
      this.saveableCanvas.getSaveData()

    );

    const { game, updateGameData } = this.props
    const canvas = localStorage.getItem("savedDrawing");

    updateGameData(game.id, canvas)
  }


  render() {
    return (
      <div id='canvasToDrawContainer'>
        <div id='tools'>
          <CirclePicker className='colorpicker'
            color={this.state.background}
            onChangeComplete={this.handleChangeComplete}
          />
          <Button
            style={{ backgroundColor: "#d32f2f", margin: 20 }}
            onClick={() => {
              this.saveableCanvas.clear();
            }}>
            Clear
          </Button>
          <Button
            style={{ backgroundColor: "#ff9900", margin: 20 }}
            onClick={() => {
              this.saveableCanvas.undo();
            }}>
            Undo
          </Button>
          <div>
            <label>Brush's size</label>
            <input
              type="number"
              value={this.state.brushRadius}
              onChange={e =>
                this.setState({ brushRadius: parseInt(e.target.value, 10) })
              }
            />
          </div>
        </div>
        <div onClick={this.saveDrawing} id='onlyCanvas'>
          <CanvasDraw
            ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
            brushColor={this.state.color}
            brushRadius={this.state.brushRadius}
            lazyRadius={1}
            canvasWidth={700}
            canvasHeight={600}
          />
        </div>
      </div>
    )

  }

}

const mapStateToProps = (state, props) => ({
  game: state.games && state.games[props.gameId],
})

const mapDispatchToProps = {
  updateGameData
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasToDraw)
