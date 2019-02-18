import * as React from 'react'

export default function Input(props) {
  return (
    <div>
      <form>
        <input type='text'
          name='answer'
          value={props.answer}
          onChange={(e) => props.onChange(e)} />
        <button onClick={(e) => props.onSubmit(e)}>Send answer</button>
      </form>
    </div>
  )
}