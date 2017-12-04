import React, { Component } from 'react';
import './About.css';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-1', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'about'
    })
  }

  componentWillReceiveProps(props) {
  }
  scrollUp() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:0, ease: Power2.easeOut});
  }
  render() {
    return (
      <main className='About'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            About DeliWin
          </div>
        </header>
        <section className='about-main-section'>
          <div className='about-title'>About</div>
          <div className='about-line'/>
          <div className='about-description'>
            DeliWin is a cafe that sells coffee, sandwiches, and bread. 
            Our coffees are custom made, meaning that the customer can 
            customize the flavor and what toppings they want inside them. 
            They can also customize the sandwiches or select from our menu, 
            which will include the Sandwich of the Month (SOTM). 
            This can make a great combination with our coffee. 
            Last but not least, our selections of bread will include what 
            hispanics call "pan dulce," and what vietnamese call "banh mi."
          </div>
          <div className='about-line'/>
          <div className='about-subtitle'>DeliWin</div>
        </section>
      </main>
    )
  }
}

export default connect()(About);