import * as React from 'react'

export default function Phrase(props) {
  return (
    <div>
      <div> {props.phrase}</div>
      <div>This should be the answer {props.answer}</div>
  <button onClick={props.onDoneHandler}>Done drawing</button>
    </div>
  )
}