<template lang="pug">
    el-container.home
        el-header
            el-row.home__row(type="flex" justify="space-between")
                el-col
                    el-button(type="primary" @click="onAdd") 新增
                    el-button(type="success" @click="onSave") 保存
                el-col.home__align--right
                    el-button(type="warning" @click="onUpdateList") 更新
        el-main
            el-row.home__row
                el-col
                    el-table(
                        :data="talbeList"
                        stripe
                        border
                        max-height="500"
                    )
                        el-table-column(label="名字")
                            template(slot-scope='{row}')
                                span(v-if="!row.isEdit") {{row.Name}}
                                el-input(
                                    v-else
                                    v-model="row.Name"
                                )
                        el-table-column(label="出生日期")
                            template(slot-scope='{row}')
                                span(v-if="!row.isEdit") {{row.DateOfBirth|filterDate}}
                                el-date-picker(
                                    v-else
                                    v-model="row.DateOfBirth"
                                    format="M/d/yyyy"
                                    default-value="1980-1-1"
                                )
                        el-table-column(label="工資")
                            template(slot-scope='{row}')
                                el-row
                                    el-col(:span="18")
                                        el-slider(
                                            v-model="row.Salary" 
                                            :max="100000" 
                                            :disabled="!row.isEdit"
                                        )
                                    el-col.home__align--right(:span="6")
                                        span {{row.Salary}}
                        el-table-column(label="地址")
                            template(slot-scope='{row}')
                                span(v-if="!row.isEdit") {{row.Address}}
                                el-input(
                                    v-else
                                    v-model="row.Address"
                                )
                        el-table-column(width="100" align="center")
                            template(slot-scope='{row}')
                                el-button(
                                    v-if="row.isEdit"
                                    type="danger"
                                    size="mini"
                                    @click="onDelete(row)"
                                ) 刪除

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { GetRecords, SaveRecords } from '@/api/employee.api';
import EmployeeListItemModel from '@/models/EmployeeListItemModel';
import { ElLoadingComponent } from 'element-ui/types/loading';
import EmployeeModel from '@/models/EmployeeModel';
@Component({
    components: {
        HelloWorld,
    },
    filters: {
        filterDate(value: string) {
            const date = new Date(value);
            return `${
                date.getMonth() + 1
            }/${date.getDate()}/${date.getFullYear()}`;
        },
    },
})
export default class Home extends Vue {
    list: Array<EmployeeListItemModel> = [];
    newList: Array<EmployeeListItemModel> = [];
    maxNum = 10;
    loading!: ElLoadingComponent;
    get hasList(): boolean {
        return !!this.list.length;
    }

    get talbeList(): Array<EmployeeListItemModel> {
        const arr = [...this.list, ...this.newList];
        // arr.push(new EmployeeListItemModel(true));
        return arr;
    }

    setLoading(bol: boolean): void {
        if (bol) {
            this.loading = this.$loading({ fullscreen: true });
        } else {
            this.loading.close();
        }
    }

    async saveRecords(): Promise<void> {
        try {
            const sendArr: Array<EmployeeModel> = [];
            this.newList.forEach((item) => {
                sendArr.push(
                    new EmployeeModel(
                        item.Name,
                        item.DateOfBirth,
                        item.Salary,
                        item.Address
                    )
                );
            });
            this.setLoading(true);
            const { data } = await SaveRecords(sendArr);
            this.setLoading(false);
            if (data.Success) {
                this.newList = [];
                this.getRecords();
            } else {
                this.$message({
                    message: data.Msg,
                    type: 'error',
                });
            }
            console.log(data);
        } catch (error) {
            window.console.log(error);
        }
    }

    async getRecords(): Promise<void> {
        try {
            this.setLoading(true);
            const res = await GetRecords();
            this.setLoading(false);
            const data = res.data.Data as Array<EmployeeListItemModel>;
            this.list = [...data];
        } catch (error) {
            window.console.log(error);
        }
    }

    checkEmployeeList(item: EmployeeListItemModel): boolean {
        return (
            item.Name === '' ||
            item.DateOfBirth === '' ||
            item.Salary === 0 ||
            item.Address === ''
        );
    }

    onAdd(): void {
        if (this.newList.length < this.maxNum) {
            this.newList.push(new EmployeeListItemModel(true));
            return;
        }
        this.$message({
            message: `新增最多一次 ${this.maxNum} 筆資料`,
            type: 'warning',
        });
    }
    onSave(): void {
        if (this.newList.length === 0) {
            this.$message({
                message: '沒有新增資料',
                type: 'warning',
            });
            return;
        }
        if (this.newList.some(this.checkEmployeeList.bind(this))) {
            this.$message({
                message: '尚有資料未填寫完整',
                type: 'warning',
            });
            return;
        }
        window.console.log('ok');
        this.saveRecords();
    }
    onUpdateList(): void {
        this.getRecords();
    }
    onDelete(row: EmployeeListItemModel): void {
        let index = this.newList.findIndex((item) => item === row);
        if (index > -1) {
            this.newList.splice(index, 1);
        }
    }
}
</script>
<style lang="scss">
.home {
    &__row {
        margin: 10px 0;
    }
    &__align {
        &--left {
            text-align: left;
        }
        &--center {
            text-align: center;
        }
        &--right {
            text-align: right;
        }
    }
}
</style>
