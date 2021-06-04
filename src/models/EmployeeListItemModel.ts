import EmployeeModel from './EmployeeModel';
export default class extends EmployeeModel {
    isEdit = false;
    constructor(isEdit = false) {
        super();
        this.isEdit = isEdit;
    }
}
