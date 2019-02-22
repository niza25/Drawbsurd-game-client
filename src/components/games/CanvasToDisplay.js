import React, { PureComponent } from 'react'
import CanvasDraw from "react-canvas-draw"


export default class CanvasToDisplay extends PureComponent {

    render() {
        if (!this.props.canvasDisplay) return 'Waiting for the drawing...'

        return (

            <CanvasDraw style={{ margin: '0 auto' }}
                disabled
                immediateLoading={true}
                hideGrid
                ref={canvasDraw => (this.loadableCanvas = canvasDraw)}
                saveData={this.props.canvasDisplay}
            />

        )
    }
}
