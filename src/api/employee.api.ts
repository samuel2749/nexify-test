import EmployeeModel from '@/models/EmployeeModel';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';

export function GetRecords(): AxiosPromise {
    return request({
        url: 'api/Record/GetRecords',
        method: 'get',
    });
}

export function SaveRecords(arr: Array<EmployeeModel>): AxiosPromise {
    return request({
        url: 'api/Record/SaveRecords',
        method: 'post',
        data: arr,
    });
}
