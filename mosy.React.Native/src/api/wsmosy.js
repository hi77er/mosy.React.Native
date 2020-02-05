import axios from 'axios';

export default axios.create({
    baseURL: "https://wsmosy.azurewebsites.net/",
    headers: {
        "Content-Type": "application/json"
    }
});