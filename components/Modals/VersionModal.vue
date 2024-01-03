<template>
    <div class="modal">
        <div class="modal-content">
            <h3>Wählen Sie eine Versionsfreigabe oder erstellen Sie eine neue:</h3>
            <ul>
                <li v-for="version in versions" :key="version.id" @click="selectVersion(version)" :class="{ selected: selectedVersion === version }">
                    {{ version.name }}
                </li>
            </ul>
            <button @click="createNewVersion">Neue Version erstellen</button>
            <button @click="confirmSelection" >Bestätigen</button>
        </div>

    </div>
</template>

<script>
export default {

    data() {
        return {
            versions: [
                {
                    id: 1,
                    name: 'Neo Suite 6.1',
                },
                {
                    id: 2,
                    name: 'Neo Suite 6.2',
                },
            ],
            selectedVersion: null,
        };
    },
    
    methods: {

        selectVersion(version) {
            this.selectedVersion = version;
        },

        createNewVersion() {

        },

        confirmSelection() {
            if(this.selectedVersion) {
                this.$emit('versionSelected', this.selectedVersion);
                console.log('Emit Version');
                this.closeModal();
            } else {
                console.error('Keine Version ausgewählt')
            }
        },
        
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>

    ul{
        list-style-type: none;
        padding: 0;
        margin: 0;  
    }
    li {
        padding: 8px;
        cursor: pointer;
        border-bottom: 1px solid #ccc; 
    }
    li:hover {
        background-color: #f0f0f0;
    }
    .selected {
        background-color: lightblue;
    }
    .modal{
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content{
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 60%;
    }
    .form-row{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .form-column{
        flex: 1;
        margin-right: 10px;
    }
    .form-column:last-child{
        margin-right: 0;
    }    
</style>