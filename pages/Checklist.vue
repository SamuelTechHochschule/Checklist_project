<template>
        <ul>
            <li>
                <div class="logo-block" href="/">
                    <img src="~/assets/Logo.png" alt="Logo" class="logo">
                </div>
            </li>
            <li>
                <div class="version-block" href="#">
                    <img src="~/assets/Version.png" alt="Version" class="version">
                    <p>Version</p>
                </div>
            </li>
            <li>
                <div class="view-block">
                    <img src="~/assets/View.png" alt="View" class="view">
                    <p>Ansicht</p>
                </div>
            </li>
            <li>
                <div class="filter-block">
                    <img src="~/assets/Filter.png" alt="Filter" class="filter">
                    <p>Filter</p>
                </div>
            </li>
            <li>
                <div class="account-block">
                    <img src="~/assets/User.png" alt="User" class="user">
                    <p>User</p>
                </div>
            </li>
        </ul>
        <h2>Checkliste zum Meilenstein XX | Versionsfreigabe: XY</h2>
        <h2>Abteilung: R&D</h2>

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
                        <tr v-for="item in checklistItems" :key="item.id">
                            <td>{{ item.number }}</td>
                            <td>{{ item.task }}</td>
                            <td>{{ item.department }}</td>
                            <td>{{ item.person }}</td>
                            <td>{{ item.plannedDate }}</td>
                            <td>{{ item.completedDate }}</td>
                            <td>{{ item.signature }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
</template>

<script>
export default {
    data(){
        return{
            checklistItems: [],
        };
    },
   
    async fetch(){
        try{
            await this.fetchChecklistItems();
        } catch (error) {
            console.error("Error in fetch hook:", error);
        }
    },
    methods: {
        async fetchChecklistItems() {
            try{
                const response = await fetch('http://localhost:5500/api/checklist');

                if(!response.ok){
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();

                if(!data || !Array.isArray(data)) {
                    throw new Error('Invalid response format');
                }

                this.checklistItems = data;
            } catch (error) {
                console.error('Error fetching checklist items:', error);
            }
        },
    },

};
</script>

<style scoped>
    .logo{
        max-width: 100%;
        max-height: 100%;
        width: 125px;
        height: 125px;
        position: absolute;
        left: 0;
    }
    ul{
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: flex-end;
    }
    li{
        margin-left: 100px;
    }
    li:first-child{
        margin-left: auto;
    }
    li div{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #00315E;
        text-decoration: none;
    }
    .version{
        max-width: 100%;
        max-height: 100%;
        width: 30px;
        height: 50px;
        margin-top: 15px;
    }
    .view{
        max-width: 100%;
        max-height: 100%;
        width: 55px;
        height: 50px;
        margin-top: 15px;
    }
    .filter{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 45px; 
        margin-top: 20px;
    }
    .user{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 50px;  
        margin-top: 15px;
    }
    h2{
        color:#00315E;
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
        width: 50%;
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
</style>