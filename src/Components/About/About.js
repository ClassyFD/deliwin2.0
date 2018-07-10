import React, { Component } from 'react';
import './About.css';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const ENV = require('../../frontenv');
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
  expandMobileNav() {
    let tl = new TimelineMax(),
        height = document.getElementsByClassName('mobile-header')[0].clientHeight;
     if (height === 222) {
        tl.to('.mobile-header', .5, {height:0});
      } else if (height === 0 && window.innerWidth < 701) {
        tl.to('.mobile-header', .5, {height:222});
     }
  }
  mobileMouseEnter(type) {
    let tl = new TimelineMax();
    tl.to(`.about-mobile-${type}`, .5, {backgroundColor:'maroon', color: 'white'})
  }
  mobileMouseLeave(type) {
    let tl = new TimelineMax();
    tl.to(`.about-mobile-${type}`, .5, {backgroundColor:'#731717', color: 'black'})     
  }
  render() {
    let mobileLogin;
    if (this.props && this.props.user) {
      mobileLogin = (
        <Link to='/profile' onMouseEnter={()=>{this.mobileMouseEnter('profile')}} onMouseLeave={()=>{this.mobileMouseLeave('profile')}} className='mobile-selector about-mobile-profile'>
          Profile
        </Link>
      )
    } else {
      mobileLogin = (
        <a href={ENV.REACT_APP_BACKEND + '/auth'} onMouseEnter={()=>{this.mobileMouseEnter('login')}} onMouseLeave={()=>{this.mobileMouseLeave('login')}} className='mobile-selector about-mobile-login'>
          Log In
        </a>
      )
    }
    return (
      <main className='About'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              About DeliWin
            </div>
            <div className='mobile-header'>
              <Link to='/checkout' onMouseEnter={()=>{this.mobileMouseEnter('checkout')}} onMouseLeave={()=>{this.mobileMouseLeave('checkout')}} className='mobile-selector about-mobile-checkout'>
                Checkout
              </Link>
              <Link to='/contact' onMouseEnter={()=>{this.mobileMouseEnter('contact')}} onMouseLeave={()=>{this.mobileMouseLeave('contact')}} className='mobile-selector about-mobile-contact'>
                Contact
              </Link>
              <Link to='/menu' onMouseEnter={()=>{this.mobileMouseEnter('menu')}} onMouseLeave={()=>{this.mobileMouseLeave('menu')}} className='mobile-selector about-mobile-menu'>
                Menu
              </Link>
              <Link to='/cafes' onMouseEnter={()=>{this.mobileMouseEnter('cafes')}} onMouseLeave={()=>{this.mobileMouseLeave('cafes')}} className='mobile-selector about-mobile-cafes'>
                Cafes
              </Link>
              <Link to='/reorder' onMouseEnter={()=>{this.mobileMouseEnter('reorder')}} onMouseLeave={()=>{this.mobileMouseLeave('reorder')}} className='mobile-selector about-mobile-reorder'>
                Reorder
              </Link>
              {mobileLogin}
            </div>
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
function mapStateToProps(state) {
  return {
    user: state.sessionUser
  }
}
export default connect(mapStateToProps)(About);