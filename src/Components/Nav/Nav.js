import React, { Component } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import './Nav.css'; 

const ENV = require('../../frontenv');

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mountedComp:''
    }
  }

  componentDidMount() {
    const api = axios.create({
      withCredentials:true
    });
    api.get(ENV.REACT_APP_BACKEND+'/auth/me').then((response)=>{
        this.props.dispatch({
          type:'SET_USER',
          val:response.data
        })
    }).catch((error)=>{
      console.log(error);
    })
  }

  componentWillReceiveProps(props) {
    console.log('props received')
    console.log(props)
    this.setState({
      mountedComp:props.mountedComp
    })
  }

  expandNav(e) {
    let tl = new TimelineMax();
    tl.to('.Nav', 1, {marginLeft: '-10%', ease: Power2.easeout});
  }

  shrinkNav(e) {
    let tl = new TimelineMax();
    tl.to('.Nav', 1, {marginLeft:'-27%', ease: Power2.easeOut});
  }
  
  expandBM(e) {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to(e.target, .5, {left: '9%', ease:Power2.easeOut}, '-=.5')  
      .to(this.state.mountedComp==='about'?'.nav-bm-1':
          this.state.mountedComp==='checkout'?'.nav-bm-2':
          this.state.mountedComp==='contact'?'.nav-bm-3':
          this.state.mountedComp==='menu'?'.nav-bm-4':
          this.state.mountedComp==='cafes'?'.nav-bm-5':
          this.state.mountedComp==='request'?'.nav-bm-6':'.blank-selector', .5, {left:'9%'}, '-=.5');
  }

  shrinkBM(e, type) {
    if (type!==this.state.mountedComp) {
      let tl = new TimelineMax();
      tl.to(e.target, .5, {left: 0, ease:Power2.easeOut});      
    }
  }

  render() {
    return (
      <main onMouseLeave={(e)=>{this.shrinkNav(e)}} onMouseEnter={(e)=>{this.expandNav(e)}} className='Nav'>
        <Link to='/' onMouseLeave={(e)=>{this.shrinkBM(e, 'about')}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-1 nav-bm-selector'>About</Link>
        <Link to='/checkout' onMouseLeave={(e)=>{this.shrinkBM(e, 'checkout')}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-2 nav-bm-selector'>Checkout</Link>
        <Link to='/contact' onMouseLeave={(e)=>{this.shrinkBM(e, 'contact')}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-3 nav-bm-selector'>Contact</Link>
        <Link to='/menu' onMouseLeave={(e)=>{this.shrinkBM(e, 'menu')}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-4 nav-bm-selector'>Menu</Link>
        <Link to='/cafes' onMouseLeave={(e)=>{this.shrinkBM(e, 'cafes')}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-5 nav-bm-selector'>Cafes Near You</Link>
        <Link to='/request' onMouseLeave={(e)=>{this.shrinkBM(e, 'request')}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-6 nav-bm-selector'>Store Request</Link>
        <a href={ENV.REACT_APP_BACKEND+'/auth'} onMouseLeave={(e)=>{this.shrinkBM(e)}} onMouseEnter={(e)=>{this.expandBM(e)}} className='nav-bm-7 nav-bm-selector'>Log In</a>
      </main>
    )
  }
}
function mapStateToProps(state) {
  return {
    mountedComp:state.mountedComp,
    user: state.sessionUser
  }
}
export default connect(mapStateToProps)(Nav);