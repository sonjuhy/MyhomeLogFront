import axios from "axios";

export default async function sendToSpring(url, type, data, params) {
    var result = {'result': 0, 'msg':'', 'data':''};
    const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    if(accessToken != null){
        const res = await axios.request({
            url: url,
            method: type,
            headers: {
                Authorization: accessToken
            },
            data: data,
            params: {params}
        });
        console.log(res);
        if(res.status === 200){
            result.result = 200;
            result.msg = 'success';
            result.data = res.data;
        }
        else if(res.status === 401 || res.status === 403){
            result.result = res.status;
            result.msg = 'UnAuthorized';
        }
        else{
            result.result = res.status;
            result.msg = 'Server error';
        }
    }
    else{
        result.result = -1;
        result.msg = 'accessToken is null or empty';
    }
    return result;
}