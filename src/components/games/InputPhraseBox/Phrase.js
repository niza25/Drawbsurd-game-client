import * as React from 'react'

export default function Phrase(props) {
  return (
    <div>
      <div> There will be a phrase to draw{props.phrase}</div>
  <button onClick={props.onDoneHandler}>Done drawing</button>
    </div>
  )
}