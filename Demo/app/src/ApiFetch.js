
const ApiFetch = {

    fetchGet: function (url) {
        return fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": "Token cd5b44d2d7a65add905ad4d02183b6d5079e9945",
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                return responseJson;
            })
            .catch(error => {
                console.log('error=>>>', error);
            });
    },

    fetchPost: function (url, body) {
        return fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": "Token cd5b44d2d7a65add905ad4d02183b6d5079e9945",
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: body,
        })
            .then(response => response.json())
            .then(responseJson => {
                return responseJson;
            })
            .catch(error => {
                console.log('Error', error);
            });
    },
};
export default ApiFetch