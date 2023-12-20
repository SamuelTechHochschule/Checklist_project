<template>
    <div class="modal" v-if="isVisible">
        <div class="modal-content">
            <h3>Filter Einstellungen</h3>
                <div class="form-row">
                    <input type="checkbox" v-model="isDepartmentFilterActive">
                    <label for="departmentFilter">Nach Abteilung sortieren:</label>
                    <select v-model="selectedDepartment" id="departmentFilter" :disabled="!isDepartmentFilterActive">
                        <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }}</option>
                    </select>
                    <button @click="closeModal">Abbrechen</button>
                    <button @click="saveChanges">Bestätigen</button>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    
    props: {
        isVisible: Boolean,
    },

    data() {
        return {
            selectedDepartment: '',
            isDepartmentFilterActive: false,
            departmentOptions: ['Alphabetical', 'AA', 'F&C', 'M&D', 'MPR&C', 'OP', 'P&P', 'PDM', 'QA', 'QM', 'R&D', 'SA', 'SC', 'SLS', 'TSC', 'WEB'],
        };
    },
            
    methods: {
        saveChanges() {
            if(this.isDepartmentFilterActive) {
                this.$emit('save', { selectedDepartment: this.selectedDepartment });
            } else {
                this.$emit('save', { selectedDepartment: '' });
            }
            this.closeModal();
        },  

        closeModal() {
            this.$emit('close');
        },
    },  
    
}
</script>

<style scoped>
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
</style>