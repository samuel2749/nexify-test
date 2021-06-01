import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
const request = axios.create({
    baseURL: 'http://nexifytw.mynetgear.com:45000/',
});
export default function (obj: AxiosRequestConfig): AxiosPromise {
    if (obj.method?.toLocaleLowerCase() === 'get') {
        if (!obj.params) obj.params = {};
        obj.params.rnd = `${new Date().getTime().toString()}${parseInt(
            (Math.random() * 10000).toString()
        )}`;
    }
    return request(obj);
}
