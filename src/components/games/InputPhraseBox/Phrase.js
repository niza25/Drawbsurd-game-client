import * as React from 'react'

export default function Phrase(props) {
  return (
    <div>
      <div>Your opponent's guess: {props.answer}</div>
  {/* <button onClick={props.onDoneHandler}>Done drawing</button> */}
    </div>
  )
}