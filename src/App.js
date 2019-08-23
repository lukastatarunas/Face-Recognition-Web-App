import React, { Component } from 'react'
import Particles from 'react-particles-js'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import './App.css'

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    size: {
      value: 3,
      random: true
    },
    opacity: {
      value: 0.2,
      random: false
    },
    line_linked: {
      opacity: 0.3
    }
  },
  interactivity: {
    detect_on: `window`,
    events: {
      onhover: {
        enable: true,
        mode: `repulse`
      }
    },
    resize: true
  }
}

const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  loadUser = data => {
    this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({ box: box })
  }

  onInputChange = e => {
    this.setState({ input: e.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input })
    fetch('https://cryptic-brook-23786.herokuapp.com/imageurl', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res) {
        fetch('https://cryptic-brook-23786.herokuapp.com/image', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(res))
    })
    .catch(err => console.log(err))
}

  onRouteChange = route => {
    if (route === 'signOut') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state
    return (
      <div className="App">
         <Particles className='particles'
          params={ particlesOptions }
        />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={ this.onRouteChange } />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries } />
              <ImageLinkForm
                onInputChange={ this.onInputChange }
                onButtonSubmit={ this.onButtonSubmit }
              />
              <FaceRecognition box={ box } imageURL={ imageURL } />
            </div>
          : (
             route === 'signIn'
             ? <SignIn onRouteChange={ this.onRouteChange } loadUser={ this.loadUser } />
             : <Register onRouteChange={ this.onRouteChange } loadUser={ this.loadUser } />
            )
        }
      </div>
    )
  }
}

export default App