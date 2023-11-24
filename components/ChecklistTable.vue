<template>
    <div class="row">
            <div class="column">
                <table id="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Erledigungspunkte aus dem PEP</th>
                            <th>FB / Abt.</th>
                            <th>Person</th>
                            <th>Termin geplant</th>
                            <th>Termin erledigt</th>
                            <th>Unterschrift erledigt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in checklistItems" :key="item.id" :class="{ 'blue-row': item.isPreliminary, 'cyan-row': item.isRelease, 'selected-row': item.selectedTaskId}" @click="handleTaskClick(item.id)">
                            <td>{{ item.number }}</td>
                            <td>{{ item.task }}</td>
                            <td>{{ item.department }}</td>
                            <td>{{ item.person }}</td>
                            <td>{{ formatDate(item.plannedDate) }}</td>
                            <td>{{ formatDate(item.completedDate) }}</td>
                            <td>{{ item.signature }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
</template>

<script>
export default {
    props: {
        checklistItems: {
            type: Array,
            required: true,
        },
        selectedTaskId: {
            type: Number,
            default: -1,
        },
    },
    methods: {
        
        formatDate(dateString) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE', options);
        },

        handleTaskClick(taskId) {
            this.$emit('taskClicked', taskId);
        },

        saveCheckboxStatus(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },

        loadCheckboxStatus(key) {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : false;
        },
    },
};
</script>

<style scoped>

    .blue-row{
        background-color: blue;
    }
    .cyan-row{
        background-color: cyan;
    }
    *{
            box-sizing: border-box;
        }
    .row{
        margin-left: -5px;
        margin-right: -5px;
    }
    .column{
        float: left;
        width: 100%;
        padding:5px;
    }
    .row::after{
        content: "";
        clear: both;
        display: table;
    }
    table{
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        border: 1px solid #000000;
    }
    td{
        cursor: pointer;
    }
    th, td{
        text-align: left;
        padding: 16px;
    }
    tr:nth-child(even){
        background-color: #cccccc;
        border: 1px solid #000000;
    }
    tr:nth-child(odd){
        background-color: #f2f2f2;
        border: 1px solid #000000;
    }
    .selected-row{
        background-color: #BCBBBB;
    }

</style>