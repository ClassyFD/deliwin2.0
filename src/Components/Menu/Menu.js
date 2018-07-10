import React, { Component } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Menu.css';
const ENV = require('../../frontenv');

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab:'sandwiches',
      sandwichesSidebar:'all',
      breadSidebar:'all',
      sidesSidebar:'all',
      drinksSidebar:'all',
      saucesSidebar:'all',
      menu: '',
      connection: true,
    }
  }

  componentDidMount() {
    let tl = new TimelineMax();
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-4', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'menu'
    })
    let ttl = new TimelineMax();
    ttl.to('.menu-'+this.state.tab+'-icon', .5, {backgroundColor:'white'})
    axios.get(ENV.REACT_APP_BACKEND+'/getMenu').then((response)=>{
      this.setState({
        menu:response.data
      })
    }).catch((err)=>{
      if (err) {
        this.setState({
          connection:false 
        })
      }
    }) 
  }
  
  componentWillReceiveProps(props) {
  }
  scrollUp() {
    let tl = new TimelineMax();
    tl.to('.Landing', 1, {marginTop:0, ease: Power2.easeOut});
  }
  selectTab(e, tab) {
    this.setState({
      tab
    })
    let tl = new TimelineMax();
    tl.to('.tab-selector', .5, {backgroundColor: 'gray'})
      .to(e.target, .5, {backgroundColor: 'white'}, '-=.5');
    setTimeout(()=>{
      this.setSidebar(tab);
    },100)
  }
  setSidebar(tab) {
    let tl = new TimelineMax();
    tl.to('.'+tab+'-selector', .5, {backgroundColor:'gray'})
      .to('.menu-sidebar-'+this.state[tab+'Sidebar']+'-'+tab, .5, {backgroundColor:'white'}, '-=.5');
  }
  selectSidebarTab(e, type, tab) {
    axios.get(ENV.REACT_APP_BACKEND+'/filter/'+tab+'/by/'+type).then((response)=>{
      let dataType = response.data.dataType;
      let data = response.data.data;
      dataType==='bread'?
      this.setState({
        menu: Object.assign({}, this.state.menu, {bread:data})
      }) : dataType==='drinks'?
      this.setState({
        menu: Object.assign({}, this.state.menu, {drinks:data})
      }) : dataType==='sauces'?
      this.setState({
        menu: Object.assign({}, this.state.menu, {sauces:data})
      }) : null;
    })
    tab==='sandwiches'?
    this.setState({
      sandwichesSidebar:type
    }) : tab==='bread'?
    this.setState({
      breadSidebar:type
    }) : tab==='sides'? 
    this.setState({
      sidesSidebar:type
    }) : tab==='drinks'?
    this.setState({
      drinksSidebar:type
    }) : tab==='sauces'?
    this.setState({
      saucesSidebar:type
    }) : null;
    let tl = new TimelineMax();
    tl.to('.'+tab+'-selector', .5, {backgroundColor: 'gray'})
      .to(e.target, .5, {backgroundColor: 'white'}, '-=.5')
  }
  addToCart(name, price) {
    this.props.dispatch({
      type: 'ADD_TO_CART',
      name,
      price
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
    let menuSidebar;
    let menuList = (
          <div className='menu-loading'>
            <div className='menu-loading-title'>
              Loading...
            </div>
          </div>
        );
    if (this.state.menu && this.state.connection) {
      if (this.state.tab==='sandwiches') {
        menuList = (
          <div className='menu-list-container'>
            {this.state.menu.sandwiches.map((el, i)=>{
              return (
                <div key={i} className='food-container'>
                  <div className={el.picture}></div>
                  <div className='food-line'/>
                  <div className='food-name'>{el.name}</div>
                  <div className='food-price'>${el.price}</div>
                  <div onClick={()=>{this.addToCart(el.name, el.price)}} className='food-bottom'>
                    <div className='food-add-toppings'>Add to Cart</div>
                    <div title='Add to Cart' className='food-add-to-cart'/>
                  </div>
                </div>
              )
            })}
          </div>
        )
      } else if (this.state.tab==='bread') {
        menuList = (
          <div className='menu-list-container'>
            {this.state.menu.bread.map((el, i)=>{
              return (
                <div className='food-container'>
                  <div className={el.picture}></div>
                  <div className='food-line'/>
                  <div className='food-name'>{el.name}</div>
                  <div className='food-price'>${el.price}</div>
                  <div onClick={()=>{this.addToCart(el.name, el.price)}} className='food-bottom'>
                    <div className='food-add-toppings'>Add to Cart</div>
                    <div title='Add to Cart' className='food-add-to-cart'/>
                  </div>
                </div>
              )
            })}
          </div>
        )
      } else if (this.state.tab==='sides') {
        menuList = (
          <div className='menu-list-container'>
            {this.state.menu.sides.map((el, i)=>{
              return (
                <div key={i} className='food-container'>
                  <div className={el.picture}></div>
                  <div className='food-line'/>
                  <div className='food-name'>{el.name}</div>
                  <div className='food-price'>${el.medium_price}</div>
                  <div onClick={()=>{this.addToCart(el.name, el.medium_price)}} className='food-bottom'>
                    <div className='food-add-toppings'>Add to Cart</div>
                    <div title='Add to Cart' className='food-add-to-cart'/>
                  </div>
                </div>
              )
            })}
          </div>
        )
      } else if (this.state.tab==='drinks') {
        menuList = (
          <div className='menu-list-container'>
            {this.state.menu.drinks.map((el, i)=>{
              return (
                <div key={i} className='food-container'>
                  <div className={el.picture}></div>
                  <div className='food-line'/>
                  <div className='food-name'>{el.name}</div>
                  <div className='food-price'>${el.medium_price}</div>
                  <div onClick={()=>{this.addToCart(el.name, el.medium_price)}} className='food-bottom'>
                    <div className='food-add-toppings'>Add to Cart</div>
                    <div title='Add to Cart' className='food-add-to-cart'/>
                  </div>
                </div>
              )
            })}
          </div>
        )
      } else if (this.state.tab==='sauces') {
        menuList = (
          <div className='menu-list-container'>
            {this.state.menu.sauces.map((el, i)=>{
              return (
                <div key={i} className='food-container'>
                  <div className={el.picture}></div>
                  <div className='food-line'/>
                  <div className='food-name'>{el.name}</div>
                  <div className='food-price'>${el.price}</div>
                  <div onClick={()=>{this.addToCart(el.name, el.price)}} className='food-bottom'>
                    <div className='food-add-toppings'>Add to Cart</div>
                    <div title='Add to Cart' className='food-add-to-cart'/>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    } else if (!this.state.connection) {
      menuList = (
        <div className='menu-failed'>
          <div className='menu-failed-title'>
            Menu failed to load.
          </div>
          <div className='menu-failed-subtitle'>
            Please check your internet connection and refresh the page.
          </div>
        </div>
      )
    }
    if (this.state.tab==='sandwiches') {
      menuSidebar = (
        <div className='menu-sidebar-container'>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'all', 'sandwiches')}} className='sandwiches-selector menu-sidebar-all-sandwiches'>All Sandwiches</div>
        </div>
      )
    } else if (this.state.tab==='bread') {
      menuSidebar = (
        <div className='menu-sidebar-container'>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'all', 'bread')}} className='bread-selector menu-sidebar-all-bread'>All Bread</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'hispanic', 'bread')}} className='bread-selector menu-sidebar-hispanic-bread'>Hispanic Bread</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'vietnamese', 'bread')}} className='bread-selector menu-sidebar-vietnamese-bread'>Vietnamese Bread</div>
        </div>
      )
    } else if (this.state.tab==='sides') {
      menuSidebar = (
        <div className='menu-sidebar-container'>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'all', 'sides')}} className='sides-selector menu-sidebar-all-sides'>All Sides</div>
        </div>
      )
    } else if (this.state.tab==='drinks') {
      menuSidebar = (
        <div className='menu-sidebar-container'>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'all', 'drinks')}} className='drinks-selector menu-sidebar-all-drinks'>All Drinks</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'hot', 'drinks')}} className='drinks-selector menu-sidebar-hot-drinks'>Hot Drinks</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'cold', 'drinks')}} className='drinks-selector menu-sidebar-cold-drinks'>Cold Drinks</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'fountain', 'drinks')}} className='drinks-selector menu-sidebar-fountain-drinks'>Fountain Drinks</div>
        </div>
      )
    } else if (this.state.tab==='sauces') {
      menuSidebar = (
        <div className='menu-sidebar-container'>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'all', 'sauces')}} className='sauces-selector menu-sidebar-all-sauces'>All Sauces</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'sweet', 'sauces')}} className='sauces-selector menu-sidebar-sweet-sauces'>Sweet Sauces</div>
          <div onClick={(e)=>{this.selectSidebarTab(e, 'classic', 'sauces')}} className='sauces-selector menu-sidebar-classic-sauces'>Classic Sauces</div>
        </div>
      )
    }
    return (
      <main className='Menu'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              Menu
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
        <section className='menu-container-section'>
          <div className='menu-food-container'>
            <div title='Sandwiches' onClick={(e)=>{this.selectTab(e, 'sandwiches')}} className='tab-selector menu-sandwiches-icon'></div>
            <div title='Bread' onClick={(e)=>{this.selectTab(e, 'bread')}} className='tab-selector menu-bread-icon'></div>
            <div title='Sides' onClick={(e)=>{this.selectTab(e, 'sides')}} className='tab-selector menu-sides-icon'></div>
            <div title='Drinks' onClick={(e)=>{this.selectTab(e, 'drinks')}} className='tab-selector menu-drinks-icon'></div>
            <div title='Sauces' onClick={(e)=>{this.selectTab(e, 'sauces')}} className='tab-selector menu-sauces-icon'></div>
          </div>
          {menuList}
          {menuSidebar}
        </section>
      </main>
    )
  }
}

export default connect()(Menu);