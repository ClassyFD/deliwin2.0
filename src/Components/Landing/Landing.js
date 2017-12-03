import React, { Component } from 'react';
import {TimelineMax, Power0} from 'gsap';
import './Landing.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let tl = new TimelineMax({
      repeat: -1,
    })
    tl.to('.landing-arrow-1', 1, {height:90, width: 90, left: 40})
      .to('.landing-arrow-2', 1, {left: 40}, '-=1')
      .to('.landing-arrow-3', 1, {height:0, width: 0, left: 40}, '-=1');
  }

  componentWillReceiveProps(props) {
  }

  scrollDown() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:'-100vh'})
  }
  
  render() {
    return (
      <main className='Landing'>
        <section onClick={(e)=>{this.scrollDown()}} className='landing-title-section'>
          <div className='landing-title'>
            DeliWin
          </div>
          <div className='landing-subtitle'>
            Cafe
          </div>
          <div className='landing-arrow'>
            <div className='landing-arrow-1'/>
            <div className='landing-arrow-2'/>
            <div className='landing-arrow-3'/>
          </div>
        </section>
      </main>
    )
  }
}

export default Landing;