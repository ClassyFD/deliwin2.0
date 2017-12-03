import React, { Component } from 'react';
import About from './Components/About/About';
import CafesNearYou from './Components/CafesNearYou/CafesNearYou';
import Checkout from './Components/Checkout/Checkout';
import Contact from './Components/Contact/Contact';
import Landing from './Components/Landing/Landing';
import Menu from './Components/Menu/Menu';
import Nav from './Components/Nav/Nav';
import OpenStore from './Components/OpenStore/OpenStore';
import ShoppingCart from './Components/ShoppingCart/ShoppingCart';
import {Switch, Route} from 'react-router';
import './App.css';
import { TimelineMax, Power2} from 'gsap';

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
        <Switch className='switch-component'>
          <Route exact path='/' component={About}/>
          <Route path='/checkout' component={Checkout}/>
          <Route path='/contact' component={Contact}/>
          <Route path='/menu' component={Menu}/>
          <Route path='/cafes' component={CafesNearYou}/>
          <Route path='/request' component={OpenStore}/>
        </Switch>
        <ShoppingCart className='shoppingcart-component'/>
      </main>
    );
  }
}

export default App;
