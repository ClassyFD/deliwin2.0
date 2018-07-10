import React, { Component } from 'react';
import About from './Components/About/About';
import CafesNearYou from './Components/CafesNearYou/CafesNearYou';
import Checkout from './Components/Checkout/Checkout';
import Contact from './Components/Contact/Contact';
import Landing from './Components/Landing/Landing';
import Menu from './Components/Menu/Menu';
import Nav from './Components/Nav/Nav';
import Reorder from './Components/Reorder/Reorder';
import ShoppingCart from './Components/ShoppingCart/ShoppingCart';
import Profile from './Components/Profile/Profile';
import {Switch, Route} from 'react-router';
import { TimelineMax, Power2} from 'gsap';
import './App.css';

const ENV = require('./frontenv');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
  }

  

  render() {
    return (
      <main className="App">
        <Landing/>
        <Nav/>
        <Switch>
          <Route exact path={'/'} component={About}/>
          <Route path={'/checkout'} component={Checkout}/>
          <Route path={'/contact'} component={Contact}/>
          <Route path={'/menu'} component={Menu}/>
          <Route path={'/cafes'} component={CafesNearYou}/>
          <Route path={'/reorder'} component={Reorder}/>
          <Route path={'/profile'} component={Profile}/>
        </Switch>
        <ShoppingCart/>
      </main>
    );  
  }
}

export default App;
