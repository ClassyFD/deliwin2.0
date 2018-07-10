import React, { Component } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps, withStateHandlers } from 'recompose';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CafesNearYou.css';
const ENV = require('../../frontenv');
const MapWithAMarker = compose(
  withProps({
    googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyAmyElK54-GlphWrw8DIVR7t45gWD689oQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement:<div style={{ height: `100%` }} />,
    containerElement:<div style={{ height: `450px` }} />,
    mapElement:<div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      axios.get('http://ip-api.com/json').then((response)=>{
        this.setState({
          lat:response.data.lat,
          lng:response.data.lon
        })
      })
      axios.get(ENV.REACT_APP_BACKEND+'/getStoreLocations').then((response)=>{
        this.setState({
          stores:response.data,
        })
      }).catch((err)=>{
        if (err) {
          this.setState({
            stores:[]
          })
        }
      })
    }
  })
  )(props => 
    <GoogleMap defaultZoom={8} center={{lat: props.lat, lng: props.lng}}>
      {props.stores && props.stores.map((el, i)=>{
        return (
          <Marker key={i} title={el.name} icon={{url:'https://cdn3.iconfinder.com/data/icons/map-markers-1/512/residence-64.png'}} position={{lat:Number(el.lat), lng:Number(el.lng)}}/>
        )
      })}
      <Marker title='Your Current Location' icon={{url:'https://cdn3.iconfinder.com/data/icons/map-markers-1/512/map_marker-64.png'}} position={{lat:props.lat, lng:props.lng}}/>
    </GoogleMap> 
  );

class CafesNearYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinateArr:[],
      connection:true,
    }
  }

  componentDidMount() {
    let tl = new TimelineMax();
    let coordinateArr = [];
    tl.to('.nav-bm-selector', .5, {left: 0, ease:Power2.easeOut})
      .to('.nav-bm-5', .5, {left: '9%', ease: Power2.easeOut}, '-=.5');
    this.props.dispatch({
      type: 'SET_MOUNTED_COMP',
      val: 'cafes'
    })
    axios.get('http://ip-api.com/json').then((response)=>{
      this.setState({
        lat:response.data.lat,
        lng:response.data.lon
      })
      axios.get(ENV.REACT_APP_BACKEND+'/getStoreLocations').then((res)=>{
        res.data.map((el)=>{
          let distance = this.calculateDistance(el, response.data);
          let obj = Object.assign({}, el, {distance});
          coordinateArr = coordinateArr.concat(obj);
        })
        this.setState({
          coordinateArr,
        })
      }).catch((err)=>{
        if (err) {
          this.setState({
            connection:false
          })
        }
      })
    })
  }
  calculateDistance(el, data) {
    let lat1 = Number(el.lat),
        lat2 = Number(data.lat),
        lon1 = Number(el.lng),
        lon2 = Number(data.lon),
        R = 6371, 
        φ1 = lat1 * Math.PI / 180,
        φ2 = lat2 * Math.PI / 180,
        Δφ = (lat2-lat1) * Math.PI / 180,
        Δλ = (lon2-lon1) * Math.PI / 180,
        a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
        d = R * c;
    return (d / 1.609344);
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
    let coords = (
      <div className='coords-loading'>
        Loading cities...
      </div>
    );
    if (this.state.coordinateArr && this.state.connection) {
      coords = this.state.coordinateArr.sort((a, b)=>{
        return a.distance - b.distance;
      }).filter((el, i)=>{
        return i <= 2;
      }).map((el)=>{
        return (
          <div className='cafes-coords'>
            {el.distance.toFixed(2)} miles away in {' '+el.name}.
          </div> 
        )
      })
    } else if (!this.state.connection) {
      coords = (
        <div className='coords-failed'>
          <div className='coords-failed-title'>
            Cities failed to load.
          </div>
          <div className='coords-failed-subtitle'>
            Please check your internet connection and refresh the page.
          </div>
        </div>
      )
    }
    return (
      <main className='CafesNearYou'>
        <header className='about-header'>
          <div onClick={()=>{this.scrollUp()}} className='about-header-deliwin'/>
          <div className='about-header-about'>
            <div onClick={()=>{this.expandMobileNav()}} className='about-main-title'>
              Cafes Near You
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
              <Link to='/reorder' onMouseEnter={()=>{this.mobileMouseEnter('reorder')}} onMouseLeave={()=>{this.mobileMouseLeave('reorder')}} className='mobile-selector about-mobile-reorder'>
                Reorder
              </Link>
              {mobileLogin}
            </div>
          </div>
        </header>
        <section className='map-container-section'>
          <MapWithAMarker/>
        </section>
        <section className='map-location-section'>
          <div className='map-location-title'>
            Visit the Stores Closest to You
          </div>
          <div className='cafes-coords-bottom'>
            {coords}  
          </div>
        </section>
      </main>
    )
  }
}

export default connect()(CafesNearYou);