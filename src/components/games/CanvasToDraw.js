import React, { PureComponent } from 'react'
import CanvasDraw from "react-canvas-draw";
import { updateGameData } from '../../actions/games'
import { connect } from 'react-redux'

class CanvasToDraw extends PureComponent {

  state = {
    color: "#ffc600",
    width: 800,
    height: 500,
    brushRadius: 4,
    lazyRadius: 5
  }

  

  saveDrawing = () => {
    localStorage.setItem(
      "savedDrawing",
      this.saveableCanvas.getSaveData()
    );

    const { game, updateGameData } = this.props

    const canvas = localStorage.getItem("savedDrawing")
    ;
    
    updateGameData(game.id, canvas)
    console.log(game.id + canvas)
  }


  // // saveDrawing = () => {
  // //   localStorage.setItem(
  // //     "savedDrawing",
  // //     this.saveableCanvas.getSaveData()
  // //   );
  // }


  render() {
    // console.log(this.saveableCanvas.getSaveData() + 'this.saveableCanvas')
    // console.log(localStorage.getItem("savedDrawing"))
    // console.log(this.props.game.canvas + 'canvasDisplay')
    document.addEventListener("click", this.saveDrawing);

    return (
      <div>
        <div>
          <button
            onClick={this.saveDrawing}
          >
            Save
          </button>
          <button
            onClick={() => {
              this.saveableCanvas.clear();
            }}
          >
            Clear
          </button>
          <button
            onClick={() => {
              this.saveableCanvas.undo();
            }}
          >
            Undo
          </button>
        </div>
        <div>
          <label>Width:</label>
          <input
            type="number"
            value={this.state.width}
            onChange={e =>
              this.setState({ width: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div>
          <label>Height:</label>
          <input
            type="number"
            value={this.state.height}
            onChange={e =>
              this.setState({ height: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div>
          <label>Brush-Radius:</label>
          <input
            type="number"
            value={this.state.brushRadius}
            onChange={e =>
              this.setState({ brushRadius: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div>
          <label>Lazy-Radius:</label>
          <input
            type="number"
            value={this.state.lazyRadius}
            onChange={e =>
              this.setState({ lazyRadius: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div>
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
