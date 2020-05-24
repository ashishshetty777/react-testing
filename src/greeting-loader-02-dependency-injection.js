import React from 'react'
import * as api from './api'

// This is gold if tht api doesnt have good support for jest mock use this trick.
// i.e make api as * and in the parameter make it a conditional prop for testing
function GreetingLoader({loadGreeting = api.loadGreeting}) {
  const [greeting, setGreeting] = React.useState('')
  async function loadGreetingForInput(e) {
    e.preventDefault()
    const {data} = await loadGreeting(e.target.elements.name.value)
    setGreeting(data.greeting)
  }
  return (
    <form onSubmit={loadGreetingForInput}>
      <label htmlFor="name">Name</label>
      <input id="name" />
      <button type="submit">Load Greeting</button>
      <div aria-label="greeting">{greeting}</div>
    </form>
  )
}

export {GreetingLoader}
