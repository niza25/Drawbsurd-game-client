import React, { PureComponent } from 'react'
import CanvasDraw from "react-canvas-draw";
import { updateGameData } from '../../actions/games'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

class CanvasToDraw extends PureComponent {

  state = {
    color: '#660066',
    width: 700,
    height: 600,
    brushRadius: 2,
    lazyRadius: 1
  }

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
    // document.getElementById('canvasToDraw').addEventListener("click", this.saveDrawing);

    return (
      <div>
        <div>
          <Button style={{backgroundColor: "#ff9900"}}
            onClick={() => {
              this.saveableCanvas.clear();
            }}>
            Clear
          </Button>
          <Button style={{backgroundColor: "#ff9900"}}
            onClick={() => {
              this.saveableCanvas.undo();
            }}>
            Undo
          </Button>
        </div>
        <div>
          <label>Change width</label>
          <input
            type="number"
            value={this.state.width}
            onChange={e =>
              this.setState({ width: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div>
          <label>Change height</label>
          <input
            type="number"
            value={this.state.height}
            onChange={e =>
              this.setState({ height: parseInt(e.target.value, 10) })
            }
          />
        </div>
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
        <div onClick={this.saveDrawing}>
          <CanvasDraw
            ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
            brushColor={this.state.color}
            brushRadius={this.state.brushRadius}
            lazyRadius={this.state.lazyRadius}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
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
