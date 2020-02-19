const handleResponse = (response) => {
    const { data, status } = response;
    if (status !== 200) {
        if (status === 401) {
            //TODO: THINK WHAT NEEDS TO HAPPEN:
            // -getting api accessToken by email, pass
            // -refreshing api accessToken 
            // -api refreshToken has expired/or not supplied
            // -api accessToken has expired/or not supplied
        }

        if (status === 403) {
            // -getting user accessToken by email, pass
            // -refreshing userAccessToken
            // -userRefreshToken has expired/or not supplied
            // -userAccessToken has expired/or not supplied
        }
        const err = data || status.text;
        throw new Error(err);
    }

    return data !== undefined ? data : true;
};

export default (req) => req
    .then(handleResponse)
    .catch(err => console.log(err.response));
