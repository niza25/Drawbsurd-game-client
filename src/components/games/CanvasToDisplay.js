import React, { PureComponent } from 'react'
import CanvasDraw from "react-canvas-draw"


export default class CanvasToDisplay extends PureComponent {

    render() {
        if (!this.props.canvasDisplay) return 'Waiting for the drawing...'

        return (
            <div>
                <CanvasDraw
                    disabled
                    immediateLoading={true}
                    hideGrid
                    ref={canvasDraw => (this.loadableCanvas = canvasDraw)}
                    saveData={this.props.canvasDisplay}
                />
            </div>

            //     <button
            //     onClick={() => {
            //       this.loadableCanvas.loadSaveData(
            //         localStorage.getItem("savedDrawing")
            //       );
            //     }}
            //   >
            //     Load what you saved previously into the following canvas. Either by
            //     calling `loadSaveData()` on the component's reference or passing it
            //     the `saveData` prop:
            //   </button>
            //   <CanvasDraw
            //     disabled
            //     hideGrid
            //     ref={canvasDraw => (this.loadableCanvas = canvasDraw)}
            //     saveData={localStorage.getItem("savedDrawing")}
            //   />
        )
    }
}
