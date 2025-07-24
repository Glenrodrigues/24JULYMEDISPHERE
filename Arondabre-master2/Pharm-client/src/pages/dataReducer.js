const initialState = {
  doctorList: [],
  // other states
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_DOCTOR_LIST":
      return {
        ...state,
        doctorList: action.payload,
      };
    // other cases
    default:
      return state;
  }
}
