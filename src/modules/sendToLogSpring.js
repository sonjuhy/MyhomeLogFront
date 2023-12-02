import axios from "axios";

export default async function sendToSpring(url, type, data, params) {
    var result = {'result': 0, 'msg':'', 'data':''};
    const res = await axios.request({
        url: url,
        method: type,
        data: data,
        params: {params}
    });
    
    if(res.status === 200){
        result.result = 200;
        result.msg = 'success';
        result.data = res.data;
    }
    else if(res.status === 404){
        result.result = res.status;
        result.msg = 'Not found';
    }
    else{
        result.result = res.status;
        result.msg = 'Server error';
    }
    return result;
}