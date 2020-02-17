import createDataContext from './createDataContext';

const locationReducer = (state, action) => {
    let result = null;
    switch (action.type) {
        case 'set_location':
            result = { ...state, lastDetectedLocation: action.payload };
            break;
        default:
            result = state;
            break;
    }
    return result;
};

const setLocation = (dispatch) => (location) => {
    dispatch({ type: 'set_location', payload: location })
};


export const { Context, Provider } = createDataContext(
    locationReducer,
    { setLocation },
    { lastDetectedLocation: null }
);
