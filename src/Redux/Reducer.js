const SET_MOUNTED_COMP = 'SET_MOUNTED_COMP',
      SET_USER = 'SET_USER';

let initialState = {
  sessionUser:'',
  mountedComp:''
};

export default function reducer(state = initialState, action){
  console.log(action.type);
  switch(action.type) {
    case SET_MOUNTED_COMP:
      return Object.assign({}, state, {mountedComp: action.val});
    case SET_USER:
      return Object.assign({}, state, {sessionUser: action.val})
    default:
      return Object.assign({}, state);
  }
}
