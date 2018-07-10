import React, { Component } from 'react';
import {TimelineMax, Power2, Power4, Power1} from 'gsap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ShoppingCart.css'
class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {
        expanded:false,
        clickable:true
      }
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(props) {
    let tl = new TimelineMax();
    let height = document.getElementsByClassName('cart-body-contents')[0].clientHeight;
    if (height === 0) {
      tl.to('.cart-header-section', .8, {width: '200px', ease:Power2.easeOut})
        .to('.cart-body-section', .8, {width: '200px', ease:Power2.easeOut}, '-=.8')
        .to('.cart-body-section', .8, {height: '400px', ease:Power2.easeOut})
    }
  }
  toggleCart() {
    let tl = new TimelineMax();
    let height = document.getElementsByClassName('cart-body-contents')[0].clientHeight;
    if (height === 0) {
      tl.to('.cart-header-section', .8, {width: '200px', ease:Power2.easeOut})
        .to('.cart-body-section', .8, {width: '200px', ease:Power2.easeOut}, '-=.8')
        .to('.cart-body-section', .8, {height: '400px', ease:Power2.easeOut})
    } else if (height === 308) {
      tl.to('.cart-body-section', .8, {height:'0px', ease:Power2.easeOut})
        .to('.cart-header-section', .8, {width: '100px', ease:Power2.easeOut})
        .to('.cart-body-section', .8, {width: '100px', ease:Power2.easeOut}, '-=.8')
    }
  }
  hoverCartElement(id) {
    let tl = new TimelineMax();
    tl.to('#cartItem'+id, .2, {backgroundColor:'pink'})
  }
  leaveCartElement(id) {
    let tl = new TimelineMax();
    tl.to('#cartItem'+id, .2, {backgroundColor:'transparent'})
  }
  removeFromCart(id) {
    let tl = new TimelineMax();
    tl.to('#cartItem'+id, .2, {width: 0, overflow:'hidden'})
      .to('#cartItem'+id, 0, {width: 200});
    setTimeout(()=>{
      this.props.dispatch({
        type:'REMOVE_FROM_CART',
        id: id
      })
    },100)
  }
  render() {
    let totalMoney = 0;
    this.props.cart? this.props.cart.map((el)=>{
      totalMoney += Number(el.price)
    }) : null; 
    let total = (
      <div className='cart-total'>
      <div className='cart-total-title'>Total Amount:</div>
      <div className='cart-total-text'>${totalMoney.toFixed(2)}</div>
    </div>
    )
    let contents;
    if (this.props && this.props.cart) {
      contents = (
        <div className='cart-body-contents'>
          {this.props.cart.map((el, i)=>{
            return (
              <div onClick={()=>{this.removeFromCart(el.itemId)}} onMouseEnter={()=>{this.hoverCartElement(el.itemId)}} onMouseLeave={()=>{this.leaveCartElement(el.itemId)}} id={`cartItem${el.itemId}`} key={i} className='cart-body-element'>
                <div className='cart-element-number'>{i+1+')'}</div>
                <div className='cart-element-name'>{el.name}</div>
                <div className='cart-element-price'>${el.price}</div>
              </div>
            )
          })}
        </div>
      )
      let dest;
      if (this.props.cart[this.props.cart.length-1]) {
        dest = this.props.cart[this.props.cart.length-1].itemId*40;
      }
      let tl = new TimelineMax();
      tl.to('.cart-body-contents', 1, {scrollTo:dest, ease:Power1.easeOut});
    }
    return (
      <main className='ShoppingCart'>
        <header onClick={()=>{this.toggleCart()}} className='cart-header-section'> Cart </header>
        <section className='cart-body-section'>
          <div className='cart-body-header'>
            <div className='cart-header-number'>#</div>
            <div className='cart-header-name'>Name</div>
            <div className='cart-header-price'>Price</div>
          </div>
          {contents}
          {total}
          <Link onClick={()=>{this.toggleCart()}} to='/checkout' className='cart-body-footer'>
            <div className='cart-footer-checkout-text'>Checkout</div>
            <div className='cart-footer-checkout-icon'/>
          </Link>
        </section>
      </main>
    )
  }
}
function mapStateToProps(state) {
  return {
    cart: state.cart
  }
}
export default connect(mapStateToProps)(ShoppingCart);