<template>
    <div class="modal" v-if="isVersionModalVisible">
        <div class="modal-content">
            <h3>Wählen/Erstellen/Bearbeiten Sie eine Versionsfreigabe:</h3>
            <ul>
                <li v-for="version in versions" :key="version.id" @click="selectVersion(version)" :class="{ selected: selectedVersion === version }">
                    {{ version.name }}
                </li>
            </ul>

            <div v-if="creatingNewVersion" class="form-column">
                <h3>Daten für neue Version angeben:</h3>
                <div class="form-row">
                    <label for="newVersionName">Name der Versionsfreigabe:</label>
                    <input v-model="newVersionName" type="text" id="newVersionName" required>
                </div>

                <div class="form-row">
                    <label for="preliminaryrelease">Datum für das Preliminary Release angeben:</label>
                    <el-date-picker v-model="preliminaryrelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>

                <div class="form-row">
                    <label for="finalrelease">Datum für das Final Release angeben:</label>
                    <el-date-picker v-model="finalrelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>
            </div>

            <div v-if="editingVersion">
                <h3>Version {{ selectedVersion.name }} bearbeiten</h3>
                <div class="form-row">
                    <label for="editedVersionName">Name der Versionsfreigabe:</label>
                    <input v-model="editedVersionName" type="text" id="editedVersionName">
                </div>

                <div class="form-row">
                    <label for="editedPreliminaryRelease">Datum für das Preliminary Release:</label>
                    <el-date-picker v-model="editedPreliminaryRelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>

                <div class="form-row">
                    <label for="editedFinalRelease">Datum für das Final Release:</label>
                    <el-date-picker v-model="editedFinalRelease" type="date" placeholder="YYYY-MM-DD"></el-date-picker>
                </div>
                <button @click="saveEditedVersion">Bestätigen</button>
            </div>

            <button @click="createNewVersion">Neue Version erstellen</button>
            <button @click="confirmSelection" >Bestätigen</button>
            <button v-if="selectedVersion" @click="editSelectedVersion">Version bearbeiten</button>
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
            preliminaryrelease: new Date(),
            finalrelease: new Date(),
            editingVersion: false,
            editedVersionName: '',
            editedPreliminaryRelease: new Date(),
            editedFinalRelease: new Date(),
        };
    },

    watch: {
        // Überprüfen, ob preliminaryrelease und finalrelease bereits Date-Objekte sind -> Wenn nicht, werden diese in Date-Objekte umgewandelt
        preliminaryrelease: {
            handler(newValue) {
                if(this.preliminaryrelease && !(this.preliminaryrelease instanceof Date)) {
                    this.preliminaryrelease = new Date(newValue);
                }
            },
            immediate: true,
        },

        finalrelease: {
            handler(newValue) {
                if(this.finalrelease && !(this.finalrelease instanceof Date)) {
                    this.finalrelease = new Date(newValue);
                }
            },
            immediate: true,
        },

        editedPreliminaryRelease: {
            handler(newValue) {
                if (this.editedPreliminaryRelease && !(this.editedPreliminaryRelease instanceof Date)) {
                    this.editedPreliminaryRelease = new Date(newValue);
                }
            },
            immediate: true,
        },
        
        editedFinalRelease: {
            handler(newValue) {
                if (this.editedFinalRelease && !(this.editedFinalRelease instanceof Date)) {
                    this.editedFinalRelease = new Date(newValue);
                }
            },
            immediate: true,
        },
    },
    
    methods: {

        // Version bearbeiten
        editSelectedVersion() {
            if(this.selectedVersion) {
                this.editedVersionName = this.selectedVersion.name;
                this.editedPreliminaryRelease = this.selectedVersion.preliminaryrelease;
                this.editedFinalRelease = this.selectedVersion.finalrelease;

                if(this.editingVersion) {
                    this.editingVersion = false;
                } else {
                    this.editingVersion = true;
                }
            } else {
                console.error('Keine Version ausgewählt');
            }
            console.log('Version bearbeiten:', this.selectedVersion)
        },

        // Bearbeitete Version speichern
        async saveEditedVersion() {
            if(this.selectedVersion && this.editedVersionName) {
                const editedVersion = {
                    id: this.selectedVersion.id,
                    name: this.editedVersionName,
                    preliminaryrelease: this.editedPreliminaryRelease,
                    finalrelease: this.editedFinalRelease,
                };

                try {
                    const response = await fetch(`http://localhost:5500/api/version/editVersion/${this.selectedVersion.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type' : 'application/json',
                        },
                        body: JSON.stringify(editedVersion),
                    });

                    if(!response.ok) {
                        throw new Error(`Server responded with status ${response.status}`)
                    }

                    // Aktualisieren der lokalen Version mit bearbeiteten Daten
                    Object.assign(this.selectedVersion, editedVersion);

                    // Bearbeitungs-Formular schließen
                    this.editingVersion = false;
                
                    console.log('Version erfolgreich bearbeitet', this.selectedVersion);
                } catch(error) {
                    console.error('Fehler beim Bearbeiten der Version:', error);
                } 
            } else {
                    console.error('Ungültige Daten für die Bearbeitung');
            }
        },

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

        // 
        createNewVersion() {
            if(this.creatingNewVersion) {
                this.creatingNewVersion = false;
            } else {
                this.creatingNewVersion = true;
            }
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

    .dashed-line{
        width: 970px;
        height: 1px;
        border-bottom: 1px dashed #000000;
        position: absolute;
        top: 56%;
        transform: translateY(-0.5px);
    }

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