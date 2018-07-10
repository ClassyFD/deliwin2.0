import React, { Component } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios'
import './Profile.css';
const ENV = require('../../frontenv');
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editFirstName:false,
      editLastName:false,
      editEmail:false,
      editAddress:false,
      editCity:false,
      editState:false,
      editZipcode:false,
      editDeliveryInstructions:false,
      editText:'',
      firstName:'First Name',
      lastName:'Last Name',
      email:'Email',
      address:'Street Address',
      city:'City',
      state:'State',
      zipcode:'Zipcode',
      deliveryInstructions:'Delivery Instructions'
    };
  }

  componentDidMount() {
    if (!this.props.user) {
      this.props.history.push('/')
    }
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-7', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'profile'
    })
  }

  componentWillReceiveProps(props) {
  }
  scrollUp() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:0, ease: Power2.easeOut});
  }
  editField(type) {
    let tl = new TimelineMax();
    let user = this.props.user
    tl.to(`.profile-selector`, .2, {height: '30px'})
      .to(`.profile-${type}-input`, 0, {display:'none'})
      .to(`.profile-save-button`, 0, {display:'none'})
      .to(`.profile-cancel-button`, 0, {display:'none'})
      .to(`.profile-${type}-input`, 0, {opacity:0})
      .to(`.profile-save-button`, 0, {opacity:0})
      .to(`.profile-cancel-button`, 0, {opacity:0});
    this.setState({
      editFirstName:false,
      editLastName:false,
      editEmail:false,
      editAddress:false,
      editCity:false,
      editState:false,
      editZipcode:false,
      editDeliveryInstructions:false,
      editText:'',
      firstName:'First Name',
      lastName:'Last Name',
      email:'Email',
      address:'Street Address',
      city:'City',
      state:'State',
      zipcode:'Zipcode',
      deliveryInstructions:'Delivery Instructions'
    })
    type==='first-name'?
    this.setState({
      editFirstName:true,
      firstName:user.first_name
    }) : type==='last-name'?
    this.setState({
      editLastName:true,
      lastName:user.last_name
    }) : type==='email'?
    this.setState({
      editEmail:true,
      email:user.email
    }) : type==='address'?
    this.setState({
      editAddress:true,
      address:user.street_address
    }) : type==='city'?
    this.setState({
      editCity:true,
      city:user.city
    }) : type==='state'?
    this.setState({
      editState:true,
      state:user.state
    }) : type==='zipcode'?
    this.setState({
      editZipcode:true,
      zipcode:user.zipcode
    }) : type==='delivery-instructions'?
    this.setState({
      editDeliveryInstructions:true,
      deliveryInstructions:user.instructions.substring(0, 15) + '...'
    }) : null
    setTimeout(() => {
      tl.to(`.profile-${type}-edit`, .5, {height: '100px'})
        .to(`.profile-${type}-input`, 0, {display:'block'})
        .to(`.profile-save-button`, 0, {display:'block'})
        .to(`.profile-cancel-button`, 0, {display:'block'})
        .to(`.profile-${type}-title`, .2, {opacity:0})
        .to(`.profile-${type}-title`, .2, {opacity:1})
        .to(`.profile-${type}-input`, .5, {opacity:1}, '-=.2')
        .to(`.profile-save-button`, .5, {opacity:1}, '-=.3')
        .to(`.profile-cancel-button`, .5, {opacity:1}, '-=.3');
    }, 200);
    setTimeout(() => {
      type==='first-name'? 
      this.setState({
        firstName: 'First Name'
      }) : type==='last-name'?
      this.setState({
        lastName: 'Last Name'
      }) : type==='email'?
      this.setState({
        email: 'Email'
      }) : type==='address'?
      this.setState({
        address: 'Street Address'
      }) : type==='city'?
      this.setState({
        city: 'City'
      }) : type==='state'?
      this.setState({
        state: 'State'
      }) : type==='zipcode'?
      this.setState({
        zipcode: 'Zipcode'
      }) : type==='delivery-instructions'?
      this.setState({
        deliveryInstructions: 'Delivery Instructions'
      }) : null
    }, 900);
  }
  profileHover(type) {
    let user = this.props.user,
    tl = new TimelineMax();
    tl.to(`.profile-${type}-text`, .1, {opacity: 0})
      .to(`.profile-${type}-text`, .1, {opacity: 1})
    setTimeout(() => {
      type==='first-name'? 
      this.setState({
        firstName: user.first_name
      }) : type==='last-name'?
      this.setState({
        lastName: user.last_name
      }) : type==='email'?
      this.setState({
        email: user.email
      }) : type==='address'?
      this.setState({
        address: user.street_address
      }) : type==='city'?
      this.setState({
        city: user.city
      }) : type==='state'?
      this.setState({
        state: user.state
      }) : type==='zipcode'?
      this.setState({
        zipcode: user.zipcode
      }) : type==='delivery-instructions'?
      this.setState({
        deliveryInstructions: user.instructions.substring(0, 15) + '...'
      }) : null    
    }, 100);
  }
  profileLeave(type) {
    let user = this.props.user,
    tl = new TimelineMax();
    tl.to(`.profile-${type}-text`, .1, {opacity: 0})
    .to(`.profile-${type}-text`, .1, {opacity: 1})
    setTimeout(() => {
      type==='first-name'? 
      this.setState({
        firstName: 'First Name'
      }) : type==='last-name'?
      this.setState({
        lastName: 'Last Name'
      }) : type==='email'?
      this.setState({
        email: 'Email'
      }) : type==='address'?
      this.setState({
        address: 'Street Address'
      }) : type==='city'?
      this.setState({
        city: 'City'
      }) : type==='state'?
      this.setState({
        state: 'State'
      }) : type==='zipcode'?
      this.setState({
        zipcode: 'Zipcode'
      }) : type==='delivery-instructions'?
      this.setState({
        deliveryInstructions: 'Delivery Instructions'
      }) : null    
    }, 100);
  }
  handleChange(val) {
    this.setState({
      editText:val
    })
  }
  submitText(type) {
    let tl = new TimelineMax();
    let user = this.props.user
    if (this.state.editText) {
      axios.post(ENV.REACT_APP_BACKEND+'/submitUserChange', {text:this.state.editText, type, user:user.user_id}).then((response)=>{
        tl.to(`.profile-selector`, .2, {height: '30px'})
          .to(`.profile-input-selector`, 0, {display:'none'})
          .to(`.profile-save-button`, 0, {display:'none'})
          .to(`.profile-cancel-button`, 0, {display:'none'})
          .to(`.profile-input-selector`, 0, {opacity:0})
          .to(`.profile-save-button`, 0, {opacity:0})
          .to(`.profile-cancel-button`, 0, {opacity:0});
        this.setState({
          editFirstName:false,
          editLastName:false,
          editEmail:false,
          editAddress:false,
          editCity:false,
          editState:false,
          editZipcode:false,
          editDeliveryInstructions:false,
          editText:'',
          firstName:'First Name',
          lastName:'Last Name',
          email:'Email',
          address:'Street Address',
          city:'City',
          state:'State',
          zipcode:'Zipcode',
          deliveryInstructions:'Delivery Instructions'
        })
        const api = axios.create({
          withCredentials:true
        });
        api.get(ENV.REACT_APP_BACKEND+'/auth/me').then((response)=>{
            this.props.dispatch({
              type:'SET_USER',
              val:response.data
            })
        }).catch((error)=>{
        })
      })
    } else {
      this.cancelText();
    }
  }
  cancelText() {
    let tl = new TimelineMax();
    tl.to(`.profile-selector`, .2, {height: '30px'})
      .to(`.profile-input-selector`, 0, {display:'none'})
      .to(`.profile-save-button`, 0, {display:'none'})
      .to(`.profile-cancel-button`, 0, {display:'none'})
      .to(`.profile-input-selector`, 0, {opacity:0})
      .to(`.profile-save-button`, 0, {opacity:0})
      .to(`.profile-cancel-button`, 0, {opacity:0});
    this.setState({
      editFirstName:false,
      editLastName:false,
      editEmail:false,
      editAddress:false,
      editCity:false,
      editState:false,
      editZipcode:false,
      editDeliveryInstructions:false,
      editText:'',
      firstName:'First Name',
      lastName:'Last Name',
      email:'Email',
      address:'Street Address',
      city:'City',
      state:'State',
      zipcode:'Zipcode',
      deliveryInstructions:'Delivery Instructions'
    })
  }
  expandMobileNav() {
    let tl = new TimelineMax(),
        height = document.getElementsByClassName('mobile-header-profile')[0].clientHeight;
     if (height === 222) {
        tl.to('.mobile-header-profile', .5, {height:0});
      } else if (height === 0 && window.innerWidth < 701) {
        tl.to('.mobile-header-profile', .5, {height:222});
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
    let firstName,
        lastName,
        email,
        address,
        city,
        state,
        zipcode,
        deliveryInstructions,
        user;
    if (this.props && this.props.user) {
      user = this.props.user;
    }
    if (this.state.editFirstName) {
      firstName = (
        <div className='profile-first-name-edit profile-selector'>
          <div className='profile-first-name-title'>
            {this.state.firstName}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-first-name-input profile-input-selector' placeholder={'First Name'} defaultValue={user.first_name}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('firstName')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      firstName = (
        <div onMouseEnter={()=>{this.profileHover('first-name')}} onMouseLeave={()=>{this.profileLeave('first-name')}} onClick={()=>{this.editField('first-name')}} className='profile-first-name-normal'>
          <div className='profile-first-name-text'>
            {this.state.firstName}
          </div>
        </div>
      )
    }
    if (this.state.editLastName) {
      lastName = (
        <div className='profile-last-name-edit profile-selector'>
          <div className='profile-last-name-title'>
            {this.state.lastName}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-last-name-input profile-input-selector' placeholder={'Last Name'} defaultValue={user.last_name}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('lastName')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      lastName = (
        <div onMouseEnter={()=>{this.profileHover('last-name')}} onMouseLeave={()=>{this.profileLeave('last-name')}} onClick={()=>{this.editField('last-name')}} className='profile-last-name-normal'>
          <div className='profile-last-name-text'>
            {this.state.lastName}
          </div>
        </div>
      )
    }
    if (this.state.editEmail) {
      email = (
        <div className='profile-email-edit profile-selector'>
          <div className='profile-email-title'>
            {this.state.email}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-email-input profile-input-selector' placeholder={'Email'} defaultValue={user.email}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('email')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      email = (
        <div onMouseEnter={()=>{this.profileHover('email')}} onMouseLeave={()=>{this.profileLeave('email')}} onClick={()=>{this.editField('email')}} className='profile-email-normal'>
          <div className='profile-email-text'>
            {this.state.email}
          </div>
        </div>
      )
    }
    if (this.state.editAddress) {
      address = (
        <div className='profile-address-edit profile-selector'>
          <div className='profile-address-title'>
            {this.state.address}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-address-input profile-input-selector' placeholder={'Street Address'} defaultValue={user.street_address}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('address')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      address = (
        <div onMouseEnter={()=>{this.profileHover('address')}} onMouseLeave={()=>{this.profileLeave('address')}} onClick={()=>{this.editField('address')}} className='profile-address-normal'>
          <div className='profile-address-text'>
            {this.state.address}
          </div>
        </div>
      )
    }
    if (this.state.editCity) {
      city = (
        <div className='profile-city-edit profile-selector'>
          <div className='profile-city-title'>
            {this.state.city}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-city-input profile-input-selector' placeholder={'City'} defaultValue={user.city}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('city')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      city = (
        <div onMouseEnter={()=>{this.profileHover('city')}} onMouseLeave={()=>{this.profileLeave('city')}} onClick={()=>{this.editField('city')}} className='profile-city-normal'>
          <div className='profile-city-text'>
            {this.state.city}
          </div>
        </div>
      )
    }
    if (this.state.editState) {
      state = (
        <div className='profile-state-edit profile-selector'>
          <div className='profile-state-title'>
            {this.state.state}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-state-input profile-input-selector' placeholder={'State'} defaultValue={user.state}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('state')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      state = (
        <div onMouseEnter={()=>{this.profileHover('state')}} onMouseLeave={()=>{this.profileLeave('state')}} onClick={()=>{this.editField('state')}} className='profile-state-normal'>
          <div className='profile-state-text'>
            {this.state.state}
          </div>
        </div>
      )
    }
    if (this.state.editZipcode) {
      zipcode = (
        <div className='profile-zipcode-edit profile-selector'>
          <div className='profile-zipcode-title'>
            {this.state.zipcode}
          </div>
          <input onChange={(e)=>{this.handleChange(e.target.value)}} className='profile-zipcode-input profile-input-selector' placeholder={'Zipcode'} defaultValue={user.zipcode}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('zipcode')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      zipcode = (
        <div onMouseEnter={()=>{this.profileHover('zipcode')}} onMouseLeave={()=>{this.profileLeave('zipcode')}} onClick={()=>{this.editField('zipcode')}} className='profile-zipcode-normal'>
          <div className='profile-zipcode-text'>
            {this.state.zipcode}
          </div>
        </div>
      )
    }
    if (this.state.editDeliveryInstructions) {
      deliveryInstructions = (
        <div className='profile-delivery-instructions-edit profile-selector'>
          <div className='profile-delivery-instructions-title'>
            {this.state.deliveryInstructions}
          </div>
          <textarea onChange={(e)=>{this.handleChange(e.target.value)}} maxLength={100} className='profile-delivery-instructions-input profile-input-selector' placeholder={'Delivery Instructions'} defaultValue={user.instructions}/>
          <div className='profile-buttons'>
            <div onClick={()=>{this.submitText('deliveryInstructions')}} className='profile-save-button'>
              Save
            </div>
            <div onClick={()=>{this.cancelText()}} className='profile-cancel-button'>
              Cancel
            </div>
          </div>
        </div>
      )
    } else {
      deliveryInstructions = (
        <div onMouseEnter={()=>{this.profileHover('delivery-instructions')}} onMouseLeave={()=>{this.profileLeave('delivery-instructions')}} onClick={()=>{this.editField('delivery-instructions')}} className='profile-delivery-instructions-normal'>
          <div className='profile-delivery-instructions-text'>
            {this.state.deliveryInstructions}
          </div>
        </div>
      )
    }
    return (
      <main className='Profile'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='profile-header-profile'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              Profile
            </div>
            <div className='mobile-header-profile'>
              <Link to='/' onMouseEnter={()=>{this.mobileMouseEnter('about')}} onMouseLeave={()=>{this.mobileMouseLeave('about')}} className='mobile-selector about-mobile-about'>
                About
              </Link>
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
            </div>
          </div>
          <a className='profile-header-logout' href={ENV.REACT_APP_BACKEND+'/auth/logout'}>Log Out</a>
        </header>
        <section className='profile-container-section'>
          <div className='profile-container-div'>
            <div className='profile-edit-text'>
              *Click to edit your information.
            </div>
            {firstName}
            {lastName}
            {email}
            {address} 
            {city}
            {state}
            {zipcode}
            {deliveryInstructions}
          </div>
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
export default connect(mapStateToProps)(Profile);