<template>
    <div class="row">
        <div class="table-container">
            <div class="column">
                <table id="table">
                    <thead>
                        <tr>
                            <th style="width: 750px;">Erledigungspunkte aus dem PEP</th>
                            <th>FB / Abt.</th>
                            <th>Person</th>
                            <th>Termin geplant</th>
                            <th>Termin erledigt</th>
                            <th>Unterschrift erledigt</th>
                            <th v-if="showMultiselector"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(tasks, category) in groupedTasks" :key="category">
                            <tr class="bodyheader">
                                <td :colspan="7">{{ category }}</td>
                            </tr>
                            <tr v-for="item in tasks"
                                :key="item.id" 
                                :class="{ 'selected-row': (item.id === selectedTaskId && !multiselectorActivated) || (multiselectorActivated && selectedTasks.includes(item.id))}" 
                                @click="showMultiselector ? handleCheckboxClick(item.id) : handleTaskClick(item.id)">
                                <td :class="{ 'font-weight-bold': item.isPreliminary || item.isRelease }">
                                    <div>
                                        {{ item.task }}
                                    </div>
                                </td>
                                <td>{{ item.department }}</td>
                                <td>{{ item.person }}</td>
                                <td :class="{'overdue-cell': isTaskOverdue(item), 'near-due-cell': isPlannedDateNear(item), 'normal-cell': isPlannedDateNormal(item)}">{{ formatDate(item.plannedDate) }}</td>
                                <td>{{ formatDate(item.completedDate) }}</td>
                                <td>{{ item.signature }}</td>
                                <td v-if="showMultiselector">
                                    <input type="checkbox" v-model="selectedTasks" :value="item.id">
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
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
            selectedTasks: [],
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
        multiselectorActivated: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        showMultiselector() {
            return this.multiselectorActivated;
        },

        groupedTasks() {
            const grouped = {};

            this.checklistItems.forEach(item => {
                if(!grouped[item.category]) {
                    grouped[item.category] = [];
                }
                grouped[item.category].push(item);
            });

            // Kategorien nach Reihenfolge sortieren
            const sortedCategories = Object.keys(grouped).sort((a, b) => {
                return parseInt(a) - parseInt(b);
            });

            // Neues Objekt mit sortierten Kategorien
            const sortedGrouped = {};
            sortedCategories.forEach(category => {
                sortedGrouped[category] = grouped[category];
            });

            return sortedGrouped;
        },
    },

    methods: {

        isTaskOverdue(item) {
            const plannedDate = new Date(item.plannedDate);
            const currentDate = new Date();
            
            return plannedDate < currentDate && !item.completedDate && !item.signature;
        },

        isPlannedDateNear(item) {
            const plannedDate = new Date(item.plannedDate);
            const currentDate = new Date();
            const timeDifference = plannedDate - currentDate;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            
            return daysDifference >= 0 && daysDifference <= 7 && !item.completedDate && !item.signature;
        },

        isPlannedDateNormal(item) {
            return !this.isTaskOverdue(item) && !this.isPlannedDateNear(item);
        },

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

        handleCheckboxClick(taskId) {
            const taskIndex = this.selectedTasks.findIndex((id) => id === taskId);
            if (taskIndex !== -1) {
              this.selectedTasks.splice(taskIndex, 1);
            } else {
              this.selectedTasks.push(taskId);
            }
            this.showButtons = this.selectedTasks.length > 0;

            console.log('Table:', this.selectedTasks);

            this.$emit('taskClicked', taskId);
        },
    },
};
</script>

<style scoped>

    .normal-cell{
        background-color: rgb(34, 209, 34);
    }

    .near-due-cell{
        background-color: rgb(221, 165, 59);
    }

    .overdue-cell{
        background-color: rgb(218, 54, 54);
    }

    .font-weight-bold{
        font-weight: bold;
    }
    .bodyheader{
        text-align: left;
        font-size: large;
        background-color: rgba(22, 97, 167, 0.651);
        border-bottom: 2px solid #000000;
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
    td:first-child div{
        width: 700px;
        word-wrap: break-word;
    }
    tbody tr{
        background-color: #dbdbdb;
        border: 1px solid #000000;
    }
    tbody tr:not(.bodyheader):hover{
        background-color: #BCBBBB;
    }
    tbody tr.selected-row{
        background-color: #9e9d9d;
    }

</style>