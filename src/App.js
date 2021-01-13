import React, { Component } from 'react';

// extract the API call outside of the componentDidMount so it will be easier to reuse and even scale
const getStudents = () => (
  fetch('http://localhost:5000/students') // our backend endpoint
    .then(response => response.json())
    .then(data => data)
)



class App extends Component {

  state = {
    data: [],
    name: '',
    age: ''
  }

  // api call to store the data we get from our backend
  componentDidMount() {
    getStudents().then(data =>
      this.setState({ data })
    )
  }

  handleForm = (event) => {
    event.preventDefault(); // we don't want the page to be reloaded since we will be loosing some state values

    // we use the same fetch method to POST our form content to our backend
    // we need to specify that it will be a POST, that we will use specific headers to match our body and the body will be stringified since the backend is not happy with objects
    fetch('http://localhost:5000/students', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        name: this.state.name,
        age: this.state.age
      })
    }) // the fetch method always returns a promise, so we can use this to control what will happen after the post is done
      .then(response => {
        if (response.status === 200) { // on the backend we are sending a 200 code so, if we receive it, we will update our state with doing the same api call to get new results
          getStudents().then(data =>
            this.setState({
              data,
              name: '',
              age: ''
            })
          )
        }
      })


  }

  handleInput = (inputChoice, event) => {
    this.setState({
      [inputChoice]: event.target.value
    })
  }

  render() {
    return (
      <div>
        <h1>Wild students</h1>
        <form onSubmit={this.handleForm}>
          <input
            value={this.state.name}
            onChange={(event) => this.handleInput('name', event)}
            placeholder='Name...'
          />
          <input
            value={this.state.age}
            onChange={(event) => this.handleInput('age', event)}
            placeholder='Age...'
            type='number'
          />
          <button>Add</button>
        </form>
        {
          this.state.data.length > 0 &&
          this.state.data.map((student, index) =>
            <p key={index}>Name: {student.name} and age: {student.age}</p>
          )
        }
      </div>
    );
  }
}

export default App;