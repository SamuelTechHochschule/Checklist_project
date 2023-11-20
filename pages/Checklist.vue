<template>
    <div class="navbar">
        <img src="~/assets/Logo.png" alt="Logo" class="logo">
        <ul>
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
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
    .logo{
        max-width: 100%;
        max-height: 100%;
        width: 125px;
        height: 125px;
    }
    .version{
        max-width: 100%;
        max-height: 100%;
        width: 50px;
        height: 70px;
    }
    .version-block{
        color: #00315E;
    }
    .view{
        max-width: 100%;
        max-height: 100%;
        width: 75px;
        height: 70px;
    }
    .filter{
        max-width: 100%;
        max-height: 100%;
        width: 60px;
        height: 55px; 
    }
    .user{
        max-width: 100%;
        max-height: 100%;
        width: 60px;
        height: 60px;  
    }
    
</style>