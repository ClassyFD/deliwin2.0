const SET_MOUNTED_COMP = 'SET_MOUNTED_COMP';

let initialState = {
  mountedComp:''
};

export default function reducer(state = initialState, action){
  console.log(action.type);
  switch(action.type) {
    case SET_MOUNTED_COMP:
      return Object.assign({}, state, {mountedComp: action.val})
    default:
      return Object.assign({}, state);
  }
}
