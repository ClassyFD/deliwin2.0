import React, { Component } from 'react';
import './Menu.css';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-4', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'menu'
    })
  }

  componentWillReceiveProps(props) {
  }

  render() {
    return (
      <main className='Menu'>
        
      </main>
    )
  }
}

export default connect()(Menu);