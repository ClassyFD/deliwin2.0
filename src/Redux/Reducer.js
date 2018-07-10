const SET_MOUNTED_COMP = 'SET_MOUNTED_COMP',
      SET_USER = 'SET_USER',
      ADD_TO_CART = 'ADD_TO_CART',
      ORDER_PLACED = 'ORDER_PLACED',
      REMOVE_FROM_CART = 'REMOVE_FROM_CART';

let initialState = {
  sessionUser:'',
  mountedComp:'',
  cart: [],
  total: 0
};

export default function reducer(state = initialState, action){
  console.log(action.type);
  switch(action.type) {
    case ORDER_PLACED:
      return Object.assign({}, state, {cart: [], total:0});
    case REMOVE_FROM_CART:
      let Rsubtotal = 0,
          Rtax = 0,
          Rtotal,
          Rfilter = state.cart.filter((e)=>{
            return action.id !== e.itemId;
          });
      for (var i = 0; i < Rfilter.length; i++) {
        Rsubtotal += Number(Rfilter[i].price);
      }
      Rtax = (Rsubtotal * 1.10) - Rsubtotal;
      Rtotal = Math.round(100*(Rsubtotal + Rtax))/100;

      return Object.assign({}, state, {
        cart: state.cart.filter((e)=>{return action.id !== e.itemId}),
        total:Rtotal
      });
    case ADD_TO_CART:
      let subtotal = 0,
          tax = 0,
          total;
      for (var i = 0; i < state.cart.length; i++) {
        subtotal += Number(state.cart[i].price);
      }
      subtotal += Number(action.price);
      tax = (subtotal * 1.10) - subtotal;
      total = Math.round(100*(subtotal + tax))/100;  
      return Object.assign({}, state, {
        cart:state.cart.concat({name: action.name, price: action.price, itemId:state.cart[state.cart.length-1]?state.cart[state.cart.length-1].itemId+1 : 1}),
        total
      });
    case SET_MOUNTED_COMP:
      return Object.assign({}, state, {mountedComp: action.val});
    case SET_USER:
      return Object.assign({}, state, {sessionUser: action.val});
    default:
      return Object.assign({}, state);
  }
}
