<template>
    <div class="row">
            <div class="column">
                <table id="table">
                    <thead>
                        <tr>
                            <th>Erledigungspunkte aus dem PEP</th>
                            <th>FB / Abt.</th>
                            <th>Person</th>
                            <th>Termin geplant</th>
                            <th>Termin erledigt</th>
                            <th>Unterschrift erledigt</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        <tr class="bodyheader">
                            <td colspan="6">1. Dokumentation</td>
                        </tr>
                        <tr class="bodyheader">
                            <td colspan="6">2. Tätigkeiten</td>
                        </tr>
                        <tr class="bodyheader">
                            <td colspan="6">3. Erweiterungspunkte zum Standard PEP</td>
                        </tr>
                        <tr class="bodyheader">
                            <td colspan="6">4. Projektspezifische Aufgaben</td>
                        </tr>
                        <tr class="bodyheader">
                            <td colspan="6">5. Aufgaben nach der Freigabe des Meilensteins</td>
                        </tr>
                    <!--
                        <tr v-for="category in categories" :key="category">
                            <td colspan="6">{{ category }}</td>
                        </tr>
                    -->    
                        <tr v-for="item in checklistItems" :key="item.id" :class="{ 'blue-row': item.colorClass_pv ==='blue-row', 'cyan-row': item.colorClass_rv === 'cyan-row', 'selected-row': item.id === selectedTaskId}" @click="handleTaskClick(item.id)">
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
/*
    data() {
        return{
            categories: ['1. Dokumentation', '2. Tätigkeiten', '3. Erweiterungspunkte zum Standard PEP', '4. Projektspezifische Aufgaben', '5. Aufgaben nach der Freigabe des Meilensteins'],
        };
    },

    computed:{
        categorizedItems() {
            const categorized = {};
            for(const category of this.categories) {
                categorized[category] = [];
            }
            for(const item of this.checklistItems) {
                categorized[item.category].push(item);
            }
            return categorized;
        },
    },
*/
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

            console.log('Handling task click for task ID:', taskId);
            this.$emit('taskClicked', taskId);
        },

    },


};
</script>

<style scoped>

    .bodyheader{
        text-align: left;
        font-size: large;
        background-color: rgb(69, 196, 69);
    }
    .blue-row{
        background-color: rgb(105, 105, 245);
    }
    .cyan-row{
        background-color: rgb(143, 226, 226);
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
    tr{
        background-color: #f2f2f2;
        border: 1px solid #000000;
    }
    tr:hover{
        background-color: #BCBBBB;
    }
    .selected-row{
        background-color: #d4d4d4;
    }

</style>