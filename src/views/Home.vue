<template lang="pug">
    .home
        img(alt='Vue logo' src='../assets/logo.png')
        hello-world(msg='Welcome to Your Vue.js + TypeScript App')
        el-row
            el-button(type="primary") 測試按鈕
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { GetRecords } from '@/api/employee.api';
@Component({
    components: {
        HelloWorld,
    },
})
export default class Home extends Vue {
    async getRecords(): Promise<void> {
        const res = await GetRecords();
        window.console.log(res.data);
    }
    mounted(): void {
        this.getRecords();
    }
}
</script>
