<template>
    <div class="row">
            <div class="column">
                <table id="table">
                    <thead>
                        <tr>
                            <th class="fixed_column">Erledigungspunkte aus dem PEP</th>
                            <th>FB / Abt.</th>
                            <th>Person</th>
                            <th>Termin geplant</th>
                            <th>Termin erledigt</th>
                            <th>Unterschrift erledigt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(tasks, category) in groupedTasks" :key="category">
                            <tr class="bodyheader">
                                <td :colspan="6">{{ category }}</td>
                            </tr>
                            <tr v-for="item in tasks" :key="item.id" :class="{ 'Preliminary-row': item.colorClass_pv ==='Preliminary-row', 'Release-row': item.colorClass_rv === 'Release-row', 'selected-row': item.id === selectedTaskId}" @click="handleTaskClick(item.id)">
                                <td :class="{ 'font-weight-bold': item.isPreliminary || item.isRelease }">{{ item.task }}</td>
                                <td>{{ item.department }}</td>
                                <td>{{ item.person }}</td>
                                <td>{{ formatDate(item.plannedDate) }}</td>
                                <td>{{ formatDate(item.completedDate) }}</td>
                                <td>{{ item.signature }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
    </div>
</template>

<script>

export default {

    data() {
        return{
            categories: {
                '1. Dokumentation': [],
                '2. Tätigkeiten': [],
                '3. Erweiterungspunkte zum Standard PEP': [],
                '4. Projektspezifische Aufgaben': [],
                '5. Aufgaben nach der Freigabe des Meilensteins': [],
            },
        };
    },

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

    computed: {
        groupedTasks() {
            const grouped = {};

            this.checklistItems.forEach(item => {
                if(!grouped[item.category]) {
                    grouped[item.category] = [];
                }
                grouped[item.category].push(item);
            });
            return grouped;
        },
    },

    methods: {
        formatDate(dateString) {
            if(!dateString) {
                return '';
            }

            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE', options);
        },

        handleTaskClick(taskId) {
            for(const tasks of Object.values(this.groupedTasks)) {
                const clickedTask = tasks.find(item => item.id === taskId);
                if(clickedTask) {
                    console.log('Handling task click for task ID:', taskId);
                    this.$emit('taskClicked', taskId);
                    return;
                }
            }
        },
    },
};
</script>

<style scoped>

    .fixed_column{
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: break-word;
    }
    .font-weight-bold{
        font-weight: bold;
    }
    .bodyheader{
        text-align: left;
        position: sticky;
        left: 0;
        font-size: large;
        background-color: rgba(22, 97, 167, 0.651);
        border-bottom: 2px solid #000000;
    }
    .Preliminary-row{
        background-color: rgb(90, 196, 164);
    }
    .Preliminary-row:hover{
        background-color: rgb(69, 151, 126);
    }
    .Release-row{
        background-color: rgb(47, 226, 92);
    }
    .Release-row:hover{
        background-color: rgb(38, 184, 74);
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
    td, th{
        text-align: center;
        padding: 16px;
    }
    td:first-child{
        text-align: left;
    }
    tbody tr{
        background-color: #f2f2f2;
        border: 1px solid #000000;
    }
    tbody tr:not(.bodyheader, .Preliminary-row, .Release-row):hover{
        background-color: #BCBBBB;
    }
    tbody tr.selected-row:not(.Preliminary-row, .Release-row){
        background-color: #9e9d9d;
    }
    tbody tr.selected-row.Release-row{
        background-color: rgb(32, 158, 64);
    }
    tbody tr.selected-row.Preliminary-row{
        background-color: rgb(58, 129, 108);
    }

</style>