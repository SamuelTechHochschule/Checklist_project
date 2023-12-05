<template>
        <ul>
            <li @click="navigateToHome">
                <NuxtLink to="/Checklist">
                    <div class="logo-block" href="/">
                        <img src="~/assets/Logo.png" alt="Logo" class="logo">
                    </div>
                </NuxtLink>
            </li>
            <li>
                <div class="logo-Mitarbeiterblock" href="/">
                    <img src="~/assets/Mitarbeiterliste.png" alt="Mitarbeiterliste" class="mitarbeiterliste">
                    <p>Mitarbeiterliste</p>
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
        
        <h2>Mitarbeiterliste</h2>
</template>

<script>
export default {

    methods:{

        navigateToHome() {
            this.$router.push({ name: 'Checklist'});
        },
    }
    
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
    .mitarbeiterliste{
        max-width: 100%;
        max-height: 100%;
        width: 60px;
        height: 50px;  
        margin-top: 15px;
    }
    h2{
        color:#00315E;
    }
</style>