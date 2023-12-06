<template>
    <div>
        <ul>
            <li @click="navigateToHome">
                <NuxtLink to="/Checklist">
                    <div class="logo-block">
                        <img src="~/assets/Logo.png" alt="Logo" class="logo">
                    </div>
                </NuxtLink>
            </li>
            <li @click="navigateToMitarbeiterliste">
                <NuxtLink to="/Mitarbeiterliste">
                    <div class="Mitarbeiterblock">
                        <img src="~/assets/Mitarbeiterliste.png" alt="Mitarbeiterliste" class="mitarbeiterliste">
                        <p>Mitarbeiterliste</p>
                    </div>
                </NuxtLink>
            </li>
            <li>
                <div class="version-block">
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
            <li @mouseenter="showUserMenu" @mouseleave="hideUserMenu">
                <div class="account-block">
                    <img src="~/assets/User.png" alt="User" class="user">
                    <p>User</p>
                </div>
                <div v-if="isUserMenuVisible" class="user-menu">
                    <ul>
                        <li @click="navigateToSettings">Einstellung</li>
                        <li @click="logout">Logout</li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

    data() {
        return{
            isUserMenuVisible: false,
        };
    },

    methods: {

        showUserMenu() {
            console.log("Hover");
            this.isUserMenuVisible = true;
        },

        hideUserMenu() {
            this.isUserMenuVisible = false;
        },

        navigateToSettings() {
            console.log('Navigating to Settings');
        },

        logout() {
            console.log('Logging out');
        },

        // Link to Homepage
        navigateToHome() {
            this.$router.push({ name: 'Checklist'});
        },

        // Link to Mitarbeiterliste
        navigateToMitarbeiterliste() {
            this.$router.push({ name: 'Mitarbeiterliste'});
        },
    },
    
}
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
        border-bottom: 1px solid #00315E;
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
    .version-block{
        padding-right: 30px;
        padding-left: 30px;
    }
    .version-block:hover{
        background-color: #d2e1f0;
    }
    .version{
        max-width: 100%;
        max-height: 100%;
        width: 30px;
        height: 50px;
        margin-top: 15px;
    }
    .view-block{
        padding-right: 30px;
        padding-left: 30px;
    }
    .view-block:hover{
        background-color: #d2e1f0;
    }
    .view{
        max-width: 100%;
        max-height: 100%;
        width: 55px;
        height: 50px;
        margin-top: 15px;
    }
    .filter-block{
        padding-right: 30px;
        padding-left: 30px;
    }
    .filter-block:hover{
        background-color: #d2e1f0;
    }
    .filter{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 45px; 
        margin-top: 20px;
    }
    .account-block{
        padding-right: 30px;
        padding-left: 30px;
    }
    .account-block:hover{
        background-color: #d2e1f0;
    }
    .user{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 50px;  
        margin-top: 15px;
    }
    .user-menu{
        position: absolute;
        right: 0;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
        z-index: 1;
        flex-direction: column;
    }
    .user-menu ul{
        list-style-type: none;
        padding: 0;
        margin: 0;  
    }
    .user-menu li {
        padding: 8px;
        cursor: pointer;
        border-bottom: 1px solid #ccc; 
    }
    .user-menu li:hover {
        background-color: #f0f0f0;
    }
    .Mitarbeiterblock{
        padding-right: 30px;
        padding-left: 30px;
    }
    .Mitarbeiterblock:hover{
        background-color: #d2e1f0;
    }
    .mitarbeiterliste{
        max-width: 100%;
        max-height: 100%;
        width: 60px;
        height: 50px;  
        margin-top: 15px;
    }
</style>