import React, { Component } from 'react';
import './Reorder.css';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
const ENV = require('../../frontenv');

class Reorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders:''
    }
  }

  componentDidMount() {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-6', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'reorder'
    })
    let user = this.props.user.user_id;
    axios.post(ENV.REACT_APP_BACKEND + '/getUserOrders', {user}).then((response)=>{
      this.setState({
        orders:response.data
      })
    });
  }

  componentWillReceiveProps(props) {
  }
  scrollUp() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:0, ease: Power2.easeOut});
  }
  expandSection(num) {
    let tl = new TimelineMax();
    let height = document.getElementsByClassName(`hidden-section-${num}`)[0].clientHeight;
    if (height === 0) {
      tl.to(`.hidden-section-${num}`, .5, {height:'200px'})
        .to(`.arrow-${num}`, .5, {rotation:-90}, '-=.5');
      } else if (height === 200) {
        tl.to(`.hidden-section-${num}`, .5, {height:'0px'})
          .to(`.arrow-${num}`, .5, {rotation:0}, '-=.5');
    }
  }
  reorderFood(cart) {
    this.props.dispatch({
      type:'ORDER_PLACED'
    });
    cart.map((e, i)=>{
      this.props.dispatch({
        type:'ADD_TO_CART',
        name:e.name,
        price:e.price
      })
    })
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
    let tabs,
        orders;
        if (this.state.orders.length > 0) {
          let filtered = this.state.orders.sort((a, b)=>{
            return b.id - a.id; 
          })
          orders = (
            <div className='reorder-orders'>
              <section className='reorder-shown-section'>
                {filtered.map((el, i)=>{
                  let cart = JSON.parse(el.cart)
                  return (
                    <div key={i} className='reorder-shown-order'>
                      <div onClick={()=>{this.expandSection(i)}} className='reorder-shown-info'>
                        {cart[0].name}{cart.length > 1? ', and ' : ', ordered on '} 
                        {cart.length > 1? cart.length - 1 : ''}
                        {cart.length > 1? ' other item(s), ordered on ': ''}
                        {moment(el.date_submitted).utc().format('MM/DD/YYYY')+' | '}
                        {'$'+el.price}
                      </div>
                      <div onClick={()=>{this.expandSection(i)}} className={'reorder-down-arrow arrow-' + i}/>
                      <div className={'reorder-hidden-section hidden-section-' + i}>
                        <div className='reorder-address-title'>
                          Delivery To:
                        </div>
                        <div className='reorder-address'>
                          {el.address}
                        </div>
                        <div className='reorder-items'>
                          Items:
                        </div>
                        <div className='reorder-item-list'>
                          {cart.map((cartEl, cartIn)=>{
                            return cartIn===cart.length-1? cartEl.name : cartEl.name+', '
                          })}
                        </div>
                        <div onClick={()=>{this.reorderFood(cart)}} className='reorder-reorder'>
                          Reorder
                        </div>
                      </div>
                    </div>
                  )
                })}
              </section>
            </div>
          )
        } else {
          orders = (
            <div className='reorder-empty'>
              <div className='reorder-empty-text'>
                Your order history is empty.
              </div>
              <Link to='/menu' className='reorder-empty-link'>
                Menu
              </Link>
            </div>
          )
        }
    if (this.props && this.props.user) {
      tabs = (
        <div className='reorder-logged-in'>
          <div className='reorder-logged-main-title'>
            Previous Orders
          </div>
          <div className='reorder-logged-line'/>
          <div className='reorder-disclaimer'>
            *Reordering an order will replace the contents of your cart with that order.
          </div>
          {orders}
        </div>
      )
    } else {
      tabs = (
        <div className='reorder-main-top'>
          <div className='reorder-tabs'>
            <div className='reorder-tabs-title'>
              Please Log In to view your order history.
            </div>
            <a href={ENV.REACT_APP_BACKEND + '/auth'} className='reorder-tabs-login'>
              Log In
            </a>
            <div className='reorder-tabs-text'>
              Orders placed while shopping as a guest will not show up in your order history.
            </div>
          </div>
        </div>
      ); 
    }
    return (
      <main className='Reorder'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              Reorder Food
            </div>
            <div className='mobile-header'>
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
              {mobileLogin}
            </div>
          </div>
        </header>
        <section className='reorder-main-section'>
            {tabs}
        </section>
      </main>
    )
  }
}
function mapStateToProps(state) {
  return {
    user: state.sessionUser,
  }
}
export default connect(mapStateToProps)(Reorder);