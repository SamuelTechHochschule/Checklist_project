<template>
    <div class="modal" v-if="isVersionModalVisible">
        <div class="modal-content">
            <h3>Wählen Sie eine Versionsfreigabe oder erstellen Sie eine neue:</h3>
            <ul>
                <li v-for="version in versions" :key="version.id" @click="selectVersion(version)" :class="{ selected: selectedVersion === version }">
                    {{ version.name }}
                </li>
            </ul>
            <button @click="createNewVersion">Neue Version erstellen</button>
            <button @click="confirmSelection" >Bestätigen</button>

            <div v-if="creatingNewVersion" class="form-column">
                <h3>Daten für neue Version angeben:</h3>
                <div class="form-row">
                    <label for="newVersionName">Name der Versionsfreigabe:</label>
                    <input v-model="newVersionName" type="text" id="newVersionName" required>
                </div>

                <div class="form-row">
                    <label for="preliminaryrelease">Datum für das Preliminary Release angeben:</label>
                    <input v-model="preliminaryrelease" type="text" id="preliminaryrelease" required>
                </div>

                <div class="form-row">
                    <label for="finalrelease">Datum für das Final Release angeben:</label>
                    <input v-model="finalrelease" type="text" id="finalrelease" required>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
export default {

    props: {
        isVersionModalVisible: Boolean,
    },

    data() {
        return {
            versions: [],
            selectedVersion: null,
            creatingNewVersion: false,
            newVersionName: '',
            preliminaryrelease: '',
            finalrelease: '',
        };
    },
    
    methods: {

        async fetchVersions() {
            try {
                const response = await fetch('http://localhost:5500/api/versions');
                if(!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                this.versions = data.sort((a, b) => a.name.localeCompare(b.name));
            } catch(error) {
                console.error('Error fetching versions:', error);
            }
        },

        selectVersion(version) {
            this.selectedVersion = version;
            this.creatingNewVersion = false;
        },

        createNewVersion() {
            this.creatingNewVersion = true;
        },

        async confirmSelection() {
            if(this.selectedVersion) {
                this.$emit('versionSelected', this.selectedVersion);
                console.log('Emit Version');
                this.closeModal();
            } else if(this.creatingNewVersion && this.newVersionName) {
                const newVersion = {
                    name: this.newVersionName,
                    preliminaryrelease: this.preliminaryrelease,
                    finalrelease: this.finalrelease,
                };

                // Hinzufügen der Aufgabe in die Datenbank
                try {
                    const response = await fetch('http://localhost:5500/api/versions/addVersion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newVersion),
                    });

                    if(!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`);
                    }

                    const createdVersion = await response.json();
                    console.log('Created Version', createdVersion);

                    // Neu erstellte Version selektiert
                    this.selectedVersion = createdVersion;

                    // Fügt erstellte Version der Liste hinzu
                    this.versions.push(newVersion);

                    // Selektierte Version emitten
                    this.$emit('versionSelected', createdVersion);

                    this.closeModal();
                } catch(error) {
                    console.error('Error creating new version:', error);
                }
            } else {
                console.error('Keine Version ausgewählt')
            }
        },
        
        closeModal() {
            console.log("Erhält Anweisung")
            this.$emit('close');
        },
    },

    async mounted() {
        if(this.isVersionModalVisible) {
            await this.fetchVersions();
        }
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