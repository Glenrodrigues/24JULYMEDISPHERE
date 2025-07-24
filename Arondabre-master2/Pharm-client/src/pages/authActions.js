export const getDoctorList = (specialist) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/doctors?specialty=${specialist}`);
    dispatch({
      type: "SET_DOCTOR_LIST",
      payload: res.data,
    });
  } catch (err) {
    console.error("Failed to fetch doctors", err);
  }
};
