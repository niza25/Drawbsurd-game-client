import * as React from 'react'
import Button from '@material-ui/core/Button'

export default function Input(props) {
  return (
    <div>
      <form>
        <input type='text'
          name='answer'
          value={props.answer}
          onChange={(e) => props.onChange(e)} />
          <br/>
        <Button onClick={(e) => props.onSubmit(e)}
          style={{backgroundColor: "#ff9900", margin: 5 }}
          size="small">
          Send answer</Button>
      </form>
    </div>
  )
}