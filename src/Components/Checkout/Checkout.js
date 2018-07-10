import React, { Component } from 'react';
import './Checkout.css';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import { Link } from 'react-router-dom';
const ENV = require('../../frontenv');
let GTotal,
    GCart,
    GAddress,
    GInstructions,
    GName,
    GUser,
    GOStatus;
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab:'checkout',
      radioTab:'card',
      order:'incomplete',
      firstName:'',
      lastName:'',
      email:'',
      street:'',
      city:'',
      state:'',
      zipcode:'',
      instructions:'',
      errorTxt:'',
      OrderErrorTxt:'',
    }
  }
  
  componentDidMount() {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-2', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'checkout'
    })
    if (this.props && this.props.user){
      let user = this.props.user;
      this.setState({
        tab: 'details',
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        street: user.street_address,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode,
        instructions: user.instructions,
      })
    }
    
  }

  componentWillReceiveProps(props) {
  }

  scrollUp() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:0, ease: Power2.easeOut});
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
    tl.to('#cartItem'+id, .2, {color:'transparent', overflow:'hidden'})
      .to('#cartItem'+id, 0, {color: 'black'});
    setTimeout(()=>{
      this.props.dispatch({
        type:'REMOVE_FROM_CART',
        id: id
      })
    },100)
  }
  handleChange(val, type) {
    type==='firstName'?
    this.setState({
      firstName:val
    }) : type==='lastName'?
    this.setState({
      lastName:val
    }) : type==='email'?
    this.setState({
      email:val
    }) : type==='street'?
    this.setState({
      street:val
    }) : type==='city'?
    this.setState({
      city:val
    }) : type==='state'?
    this.setState({
      state:val
    }) : type==='zipcode'?
    this.setState({
      zipcode:val
    }) : type==='instructions'?
    this.setState({
      instructions:val
    }) : null
  }
  continueToPayment() {
    if (!this.state.firstName) {
      this.setState({
        errorTxt:'Invalid First Name!'
      })
    } else if (!this.state.lastName) {
      this.setState({
        errorTxt:'Invalid Last Name!'
      })
    } else if (!this.state.email) {
      this.setState({
        errorTxt:'Invalid Email Address!'
      })
    } else if (!this.state.street) {
      this.setState({
        errorTxt:'Invalid Street Address!'
      })
    } else if (!this.state.city) {
      this.setState({
        errorTxt:'Invalid City!'
      })
    } else if (!this.state.state) {
      this.setState({
        errorTxt:'Invalid State!'
      })
    } else if (!this.state.zipcode) {
      this.setState({
        errorTxt:'Invalid Zipcode!'
      })
    } else {
      this.setState({
        tab:'payment',
        errorTxt:''
      })
      let tl = new TimelineMax();
      setTimeout(()=>{
        if (this.state.radioTab==='cash') {
          tl.to('.checkout-cash-radio-dot', .5, {height:'15px', width:'15px'})
        } else if (this.state.radioTab==='card') {
          tl.to('.checkout-card-radio-dot', .5, {height:'15px', width:'15px'})
        }
      },100)
    }
  }
  selectRadioTab(tab) {
    let tl = new TimelineMax();
    if (tab==='card') {
      tl.to('.checkout-cash-radio-dot', .5, {height:'0px', width:'0px'}) 
        .to('.checkout-card-radio-dot', .5, {height:'15px', width:'15px'}, '-=.5'); 
      this.setState({
        radioTab:'card'
      });
    } else if (tab==='cash') {
      tl.to('.checkout-card-radio-dot', .5, {height:'0px', width:'0px'}) 
        .to('.checkout-cash-radio-dot', .5, {height:'15px', width:'15px'}, '-=.5');
      this.setState({
        radioTab:'cash'
      })
    } 
  }
  placeOrder(type) {
    if (this.props.cart.length < 1) {
      this.setState({
        OrderErrorTxt:'Please add an item to your cart before placing an order!'
      })
    } else {
      this.setStripeValues('cb');
    }
  }
  checkOrderStatus() {
    for (var i = 0; i < 3; i++) {
      setTimeout(() => {
        if (GOStatus === 'done') {
          this.setState({
            order:'complete'
          });
          this.props.dispatch({
            type:'ORDER_PLACED'
          });
        }
      }, i*1000);
    }
  }
  onToken(token) {
    let newToken = Object.assign({}, token, {price: GTotal, cart: GCart, date_submitted: new Date, address:GAddress, status:'Pending', order_name:GName, delivery_instructions:GInstructions, user_id:GUser});
    axios.post(ENV.REACT_APP_BACKEND+'/saveStripeToken', newToken).then((response)=>{
      GOStatus = 'done';
    })
  }
  setStripeValues(cb) {
    let props = this.props;
    GCart = props.cart;
    GTotal = props.total;
    GAddress = this.state.street + ', ' + this.state.city + ', ' + this.state.state + ', ' + this.state.zipcode;
    GInstructions = this.state.instructions;
    GName = this.state.firstName + ' ' + this.state.lastName;
    if (this.props && this.props.user) {
      GUser = this.props.user.user_id;
    } else {
      GUser = null;
    }
    if (cb) {
      this.onToken({email:this.state.email, type:'cash', id:Math.random().toString(36).substring(5, 10)+(Math.floor(Math.random() * 10000) + 10).toString() + Math.random().toString(36).substring(5, 10)});
      this.checkOrderStatus();
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
    let checkoutOrder,
        subtotal = 0,
        tax = 0;
    let checkoutStyle,
        detailStyle,
        paymentStyle,
        textAdjust,
        textAdjust2,
        textAdjust3;
    if (this.props && this.props.user) {
      if (this.state.tab==='details') {
        detailStyle = {
          background:'transparent',
          border:'none',
          gridArea:'1 / 1'
        };
        paymentStyle = {
          background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
          borderTop: 'ridge gray 2px',
          borderRight: 'groove gray 2px',
          borderBottom: 'ridge gray 5px',
          borderLeft: 'ridge gray 5px',
          gridArea:'1 / 2'
        };
      } else if (this.state.tab==='payment') {
        detailStyle = {
          background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
          borderTop: 'ridge gray 2px',
          borderLeft: 'ridge gray 2px',
          borderBottom: 'ridge gray 5px',
          borderRight: 'groove gray 5px',
          gridArea:'1 / 1'
        };
        paymentStyle = {
          background:'transparent',
          border:'none',
          gridArea:'1 / 2'
        }
      }
    } else if (this.state.tab==='checkout') {
      checkoutStyle = {
        background:'transparent',
        border:'none',
      };
      detailStyle = {
        background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
        borderTop: 'ridge gray 2px',
        borderRight: 'none',
        borderBottom: 'ridge gray 5px',
        borderLeft: 'ridge gray 5px',
      };
      paymentStyle = {
        background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
        borderTop: 'ridge gray 2px',
        borderRight: 'groove gray 2px',
        borderBottom: 'ridge gray 5px',
        borderLeft: 'ridge gray 5px',
      };
    } else if (this.state.tab==='details') {
      checkoutStyle = {
        background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
        borderTop: 'ridge gray 2px',
        borderLeft: 'ridge gray 2px',
        borderBottom: 'ridge gray 5px',
        borderRight: 'groove gray 5px',
      };
      detailStyle = {
        background:'transparent',
        border:'none',
      };
      paymentStyle = {
        background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
        borderTop: 'ridge gray 2px',
        borderRight: 'groove gray 2px',
        borderBottom: 'ridge gray 5px',
        borderLeft: 'ridge gray 5px',
      };
    } else if (this.state.tab==='payment') {
      checkoutStyle = {
        background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
        borderTop: 'ridge gray 2px',
        borderLeft: 'ridge gray 2px',
        borderBottom: 'ridge gray 5px',
        borderRight: 'groove gray 5px',
      };
      detailStyle = {
        background:'-webkit-linear-gradient(300deg, #4e5c5a 0%, gray 15%, #829d98 50%, gray 85%, #4e5c5a 100%)',
        borderTop: 'ridge gray 2px',
        borderLeft: 'none',
        borderBottom: 'ridge gray 5px',
        borderRight: 'groove gray 5px'
      };
      paymentStyle = {
        background:'transparent',
        border:'none',
      };
      textAdjust = {
        marginLeft:'-1px'
      };
      textAdjust2 = {
        marginLeft: '-3px'
      };
    }
    let checkoutBottomTabs;
    let radioTabs;
    if (this.state.order==='incomplete') {
      if (this.state.tab==='checkout') {
        checkoutBottomTabs = (
          <div className='checkout-bottom-tabs'>
            <div className='checkout-bottom-sign-in-text'>
              Sign in to your account for faster checkout.
            </div>
            <a href={ENV.REACT_APP_BACKEND+'/auth'} className='checkout-bottom-login'>
              Log In
            </a>
            <div className='checkout-bottom-or'>
              or
            </div>
            <div onClick={()=>{this.setState({tab:'details'})}} className='checkout-bottom-guest'>
              Continue as Guest
            </div>
          </div>
        )
      } else if (this.state.tab==='details') {
        checkoutBottomTabs = (
          <div className='checkout-details'>
            <div onClick={()=>this.setState({tab:'checkout'})} className={this.props.user?'default-class':'checkout-back-arrow'}/>
            <div className='checkout-full-name'>
              Full Name
            </div>
            <div className='checkout-name-inputs'>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'firstName')}} className='checkout-firstname-input' placeholder='First Name' defaultValue={this.state.firstName? this.state.firstName : this.props.user.first_name}/>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'lastName')}} className='checkout-lastname-input' placeholder='Last Name' defaultValue={this.state.lastName? this.state.lastName : this.props.user.last_name}/>
            </div>
            <div className='checkout-email'>
              Email Address
            </div>
            <input onChange={(e)=>{this.handleChange(e.target.value, 'email')}} className='checkout-email-input' placeholder='Email Address' defaultValue={this.state.email? this.state.email : this.props.user.email}/>
            <div className='checkout-address'>
              Home Address
            </div>
            <input onChange={(e)=>{this.handleChange(e.target.value, 'street')}} className='checkout-street-address-input' placeholder={'Street Address'} defaultValue={this.state.street? this.state.street : this.props.user.street_address}/>
            <div className='checkout-address-inputs'>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'city')}} className='checkout-city-input' placeholder='City' defaultValue={this.state.city? this.state.city : this.props.user.city}/>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'state')}} className='checkout-state-input' placeholder='State' defaultValue={this.state.state? this.state.state : this.props.user.state}/>
              <input onChange={(e)=>{this.handleChange(e.target.value, 'zipcode')}} className='checkout-zipcode-input' placeholder='Zipcode' defaultValue={this.state.zipcode? this.state.zipcode : this.props.user.zipcode}/>
            </div>
          </div>
        )
      } else if (this.state.tab==='payment') {
        if (this.state.radioTab === 'card') {
          radioTabs = (
            <div className='checkout-radio-card'>
              <div className='checkout-radio-card-text'>
                Your credit card transaction will be processed by your Deliwin store location 
                and you must present your card to the driver at the time Deliwin delivers your order 
                for a credit card imprint and your signature.
              </div>
              <div className='checkout-radio-card-bottom'>
                <StripeCheckout 
                  name="Deliwin"
                  description="We appreciate your business."
                  image="https://image.ibb.co/cdmstk/Deliwin_stripe.png"
                  currency="USD"
                  amount={this.props.total*100}
                  token={this.onToken}
                  opened={()=>{this.setStripeValues()}}
                  closed={()=>{this.checkOrderStatus()}}
                  stripeKey={ENV.REACT_APP_STRIPE_KEY}>
                    <button style={this.props.cart.length<1?{opacity:.6, cursor: 'default'}:{opacity:1, cursor: 'pointer'}} className='checkout-stripe-button' disabled={this.props.cart.length<1?true:false} onSubmit={(e)=>{e.preventDefault()}}>
                      {this.props.cart.length>=1?'Pay $'+this.props.total:'No Items In Cart'}
                    </button>
                  </StripeCheckout>
              </div>
            </div>
          )
        } else {
          radioTabs = (
            <div className='checkout-radio-cash'>
              <div className='checkout-radio-cash-text'>
                For cash payments, bills higher than $20 will not be accepted.  
              </div>
              <div className='checkout-radio-cash-bottom'>
                <div className='checkout-radio-cash-error-text'>
                  {this.state.OrderErrorTxt}
                </div>
                <div onClick={()=>{this.placeOrder('cash')}} className='checkout-radio-cash-button'>
                  Place Your Order
                </div>
              </div>
            </div>
          )
        }
        checkoutBottomTabs = (
          <div className='checkout-payment'>
            <div onClick={()=>this.setState({tab:'details'})} className={'checkout-back-arrow'}/>
            <form className='checkout-payment-form'>
              <div className='checkout-credit-container'>
                <div onClick={()=>{this.selectRadioTab('card')}} className='checkout-card-radio'>
                  <div className='checkout-card-radio-dot'/>
                </div>
                <div className='checkout-card-text'> Credit/Debit </div>
              </div>
              <div className='checkout-cash-container'>
                <div onClick={()=>{this.selectRadioTab('cash')}} className='checkout-cash-radio'>
                  <div className='checkout-cash-radio-dot'/>
                </div>
                <div className='checkout-cash-text'>Cash</div>  
              </div>
            </form>
            <div className='checkout-payment-line'/>
            {radioTabs}
          </div>
        )
      }
    } else if (this.state.order==='complete') {
      checkoutBottomTabs = (
        <div className='checkout-complete'>
          <div className='checkout-complete-text'>
            Thank you for choosing DeliWin! your order has been placed and will be delivered shortly!
          </div>
          <Link to='/menu' className='checkout-complete-return'>
            Back to Menu
          </Link>
        </div>
      )
    }
    let tabs;
    if (this.props && this.props.user) {
      tabs = (
        <div className='checkout-tabs'>
          <div className='checkout-top-tabs'>
            <div style={detailStyle} className='checkout-tabs-details'>
              Details
            </div>
            <div style={paymentStyle} className='checkout-tabs-payment'>
              Payment
            </div>
          </div>
          {checkoutBottomTabs}
        </div>
      )
    } else {
      tabs = (
        <div className='checkout-tabs'>
          <div className='checkout-top-tabs'>
            <div style={checkoutStyle} className='checkout-tabs-checkout'>
              <div style={textAdjust}>
                Checkout
              </div>
            </div>
            <div style={detailStyle} className='checkout-tabs-details'>
              <div style={textAdjust2}>
                Details
              </div>
            </div>
            <div style={paymentStyle} className='checkout-tabs-payment'>
              <div style={textAdjust3}>
                Payment
              </div>
            </div>
          </div>
          {checkoutBottomTabs}
        </div>
      ); 
    } 
    if (this.props && this.props.cart) {
      checkoutOrder = this.props.cart.map((el, i)=>{
        subtotal += Number(el.price);
        tax = (subtotal * 1.10) - subtotal;
        return (
          <div onClick={()=>{this.removeFromCart(el.itemId)}} onMouseEnter={()=>{this.hoverCartElement(el.itemId)}} onMouseLeave={()=>{this.leaveCartElement(el.itemId)}} id={`cartItem${el.itemId}`} key={i} className='checkout-order-element'>
            <div className='checkout-order-number'>
              {i+1})
            </div>
            <div className='checkout-order-name'>
              {el.name}
            </div>
            <div className='checkout-order-price'>
              ${el.price}
            </div>
          </div>
        )
      })
    }
    let deliveryInstructions;
    let bottomContinue;
    if (this.state.tab==='details') {
      bottomContinue = (
        <div className='checkout-bottom-section'>
          <div className='checkout-missing-info'>
            {this.state.errorTxt}
          </div>
          <div onClick={()=>{this.continueToPayment()}} className='checkout-continue'>
            Continue
          </div>
        </div>
      )
      deliveryInstructions = (
        <div className='checkout-delivery-instructions'>
          <div className='checkout-delivery-title'>
            Delivery Instructions
          </div>
          <textarea onChange={(e)=>{this.handleChange(e.target.value, 'instructions')}} className='checkout-delivery-input' placeholder='ex: knock 3 times then ring bell.' defaultValue={this.state.instructions? this.state.instructions : this.props.user.instructions}/>
        </div>
      )
    } else {
      bottomContinue = null;
      deliveryInstructions = null;
    }
    return (
      <main className='Checkout'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              Checkout
            </div>
            <div className='mobile-header'>
              <Link to='/' onMouseEnter={()=>{this.mobileMouseEnter('about')}} onMouseLeave={()=>{this.mobileMouseLeave('about')}} className='mobile-selector about-mobile-about'>
                About
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
        <section className='checkout-main-section'>
          <div className='checkout-main-align'>
            <div className='checkout-main-top'>
              {tabs}
            </div>
            <div className='checkout-main-bottom'>
              {deliveryInstructions}
            {bottomContinue}
            </div>
          </div>
          <div className='checkout-main-cart'>
             <div className='checkout-cart-title'>
               My Order
             </div>
             <div className='checkout-cart-order'>
              {checkoutOrder}
             </div>
             <div className='checkout-cart-prices'>
               <div className='checkout-subtotal'>
                 <div className='checkout-subtotal-text'>
                   Sub Total
                 </div>
                 <div className='checkout-subtotal-number'>
                   ${subtotal.toFixed(2)}
                 </div>
               </div>
               <div className='checkout-tax'>
                 <div className='checkout-tax-text'>
                   Tax
                 </div>
                 <div className='checkout-tax-number'>
                   ${tax.toFixed(2)}
                 </div>
               </div>
               <div className='checkout-total'>
                 <div className='checkout-total-text'>
                   Total
                 </div>
                 <div className='checkout-total-number'>
                   ${(subtotal + tax).toFixed(2)}
                 </div>
               </div>
             </div>
             <div className='checkout-cart-info'>
             Total does not include tip. Please remember to show your appreciation to your driver. 
             If paying with a credit card, you can add a tip to your total when signing your order receipt - cash is not necessary.
             </div>
             <Link to='/menu' className='checkout-back-to-menu'>
               Back to Menu
             </Link>
          </div>
        </section>
      </main>
    )
  }
}
function mapStateToProps(state) {
  return {
    cart: state.cart,
    user: state.sessionUser,
    total: state.total,
  }
}
export default connect(mapStateToProps)(Checkout);