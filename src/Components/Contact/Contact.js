import React, { Component } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './Contact.css';
const ENV = require('../../frontenv');
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab:'user',
      formText:'',
      submitText:'',
      color: '', 
      nameText: '',
      emailText: ''
    }
  }

  componentDidMount() {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-3', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'contact'
    })
    if (this.props.user.name) {
      this.setState({
        nameText: this.props.user.name
      })
    }
    if (this.props.user.email) {
      this.setState({
        emailText: this.props.user.email
      })
    }
  }

  componentWillReceiveProps(props) {
  }

  scrollUp() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:0, ease: Power2.easeOut});
  }

  selectTab(tab) {
    this.setState({
      tab
    })
  }
  handleChange(val, type) {
    type==='formText'?
    this.setState({
      formText: val,
    }) :
    type==='name'? 
    this.setState({
      nameText: val,
    }) : 
    type==='email'?
    this.setState({
      emailText: val,
    }) : null
  }
  submitForm(e) {
    e.preventDefault();
    if (this.state.tab==='user') {
      if (!this.props.user.name) {
        this.setState({
          submitText: 'Please visit your '+(<Link to='/profile'>profile</Link>)+' and add a name!',
          color: 'maroon'
        })
      } else if (!this.props.user.email) {
        this.setState({
          submitText: 'Please visit your '+(<Link to='/profile'>profile</Link>)+' and add an email!',
          color: 'maroon'
        })
      } else if (!this.state.formText) {
        this.setState({
          submitText: "You can't submit empty feedback!",
          color: 'maroon'
        })
      } else {
        let d = new Date;
        axios.post(ENV.REACT_APP_BACKEND + '/submitFeedback', {name:this.props.user.name, email: this.props.user.email, feedback_text: this.state.formText, date:d}).then((response)=>{
        })
        this.setState({
          submitText: 'Submitted, Thank you for your feedback!',
          color: 'green',
          formText: ''
        })
        this.inputVal.reset();
      }  
    } else if (this.state.tab==='guest') {
      if (!this.state.nameText) {
        this.setState({
          submitText: 'Please add a name!',
          color: 'maroon'
        })
      } else if (!this.state.emailText) {
        this.setState({
          submitText: 'Please add an email!',
          color: 'maroon'
        })
      } else if (!this.state.formText) {
        this.setState({
          submitText: "You can't submit empty feedback!",
          color: 'maroon'
        })
      } else {
        let d = new Date;
        axios.post(ENV.REACT_APP_BACKEND + '/submitFeedback', {name:this.props.user.name, email: this.props.user.email, feedback_text: this.state.formText, date:d}).then((response)=>{
        })
        this.setState({
          submitText: 'Submitted, Thank you for your feedback!',
          color: 'green',
          formText: ''
        })
        this.inputVal.reset();
      }
    }
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
    let contactForm = ''
    if (this.props.user && this.state.tab === 'user') {
      contactForm = (
        <div className='contact-form-contents'>
          <h1 className='contact-form-please-log-in'>Visit your <Link to='/profile'>profile</Link> to change these settings.</h1>
          <div className='contact-form-user-info'>
            <div>{this.props.user.name?'Name: '+ this.props.user.name : 'Please visit your profile to add a name.'}</div>
            <div>{this.props.user.email?'Email: '+ this.props.user.email : 'Please visit your profile to add an email.'}</div>
          </div>
          <div className='contact-form-values'>
            <textarea onChange={(e)=>this.handleChange(e.target.value, 'formText')} placeholder='Having Problems? Let us know!' className='contact-form-textarea'></textarea>
            <div className='contact-form-bottom'>
              <div style={{color: this.state.color}} className='contact-submit-text'>{this.state.submitText}</div>
              <button type='submit' className='contact-form-submit'>Submit</button>
            </div>
          </div>
        </div>
      )
    } else if (this.state.tab === 'user') {
      contactForm = (
        <div className='contact-form-contents'>
          <h1 className='contact-form-please-log-in'>Please log in to use saved information!</h1>
          <a className='contact-form-log-in' href={ENV.REACT_APP_BACKEND+'/auth'}>Log In</a>
        </div>
      )
    } else {
      contactForm = (
        <div className='contact-form-contents'>
          <div className='contact-form-guest-info'>
            <div className='contact-form-guest-name'>
              <div>Name: </div>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'name')}} maxLength={50} defaultValue={this.props.user.name}></input>
            </div>
            <div className='contact-form-guest-email'>
              <div>Email: </div>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'email')}} maxLength={50} defaultValue={this.props.user.email}></input>
            </div>
          </div>
          <div className='contact-form-values'>
            <textarea onChange={(e)=>this.handleChange(e.target.value, 'formText')} placeholder='Having Problems? Let us know!' className='contact-form-textarea'></textarea>
            <div className='contact-form-bottom'>
              <div style={{color: this.state.color}} className='contact-submit-text'>{this.state.submitText}</div>
              <button type='submit' className='contact-form-submit'>Submit</button>
            </div>
          </div>
        </div>
      )
    }
    
    let guestStyle = this.state.tab === 'user'? {
      background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
      borderTop: 'ridge gray 2px',
      borderRight: 'groove gray 2px',
      borderBottom: 'ridge gray 5px',
      borderLeft: 'ridge gray 5px',
      cursor: 'pointer'
    } : {
      background:'transparent',
      border:'none',
      cursor:'default'
    }
    let userStyle = this.state.tab === 'user'? {
      background:'transparent',
      border:'none',
      cursor:'default'
    } : {
      background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
      borderTop: 'ridge gray 2px',
      borderLeft: 'ridge gray 2px',
      borderBottom: 'ridge gray 5px',
      borderRight: 'groove gray 5px',
      cursor: 'pointer'
    }
    let guestTab = (
      <div style={guestStyle} onClick={()=>{this.selectTab('guest')}} className='contact-guest-section'>
        Custom Info
      </div>
    );
    let userTab = (
      <div style={userStyle} onClick={()=>{this.selectTab('user')}} className='contact-user-section'>
        Saved Info
      </div>
    )
    return (
      <main className='Contact'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              Contact DeliWin
            </div>
            <div className='mobile-header'>
              <Link to='/' onMouseEnter={()=>{this.mobileMouseEnter('about')}} onMouseLeave={()=>{this.mobileMouseLeave('about')}} className='mobile-selector about-mobile-about'>
                About
              </Link>
              <Link to='/checkout' onMouseEnter={()=>{this.mobileMouseEnter('checkout')}} onMouseLeave={()=>{this.mobileMouseLeave('checkout')}} className='mobile-selector about-mobile-checkout'>
                Checkout
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
        <section className='contact-main-section'>
          <div className='contact-basic-info'>
            <div className='contact-phone-number'>
              <h1 className='contact-phone-number-title'>Phone Number</h1>
              <h2 className='contact-phone-number-text'>(123)-456-7890</h2>
            </div>
            <div className='contact-email'>
              <h1 className='contact-email-title'>Email Address</h1>
              <h2 className='contact-email-text'>deliwin@gmail.com</h2>
            </div>
          </div>
          <div className='contact-line'/>
          <form ref={(e)=>{this.inputVal = e}} onSubmit={(e)=>{this.submitForm(e)}} className='contact-form'>
            <div className='contact-form-tabs'>
              {userTab}
              {guestTab}
            </div>
            {contactForm}
          </form>
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
export default connect(mapStateToProps)(Contact);