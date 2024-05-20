const storeToken = (value) => {
    if (value) {
        console.log(value);
        const { access, refresh } = value;
        console.log("token: ",value)
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

    }
}

const storePostId = (value) => {
    console.log("storepostId", value)
    if (value) {
        console.log("post",value)
        localStorage.setItem('firstPostId', value)
    }
}

const getToken = () => {
    let access_token = localStorage.getItem('access_token');
    let refresh_token = localStorage.getItem('refresh_token');
    return { access_token, refresh_token }
}

const removeToken = () => {

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

}




const getPostId = () => {
    let firstPostId = localStorage.getItem('firstPostId');
    return firstPostId
}

export {getToken, storeToken, removeToken, storePostId, getPostId};