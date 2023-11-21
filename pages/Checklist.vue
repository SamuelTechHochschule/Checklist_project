<template>
        <ul class="nav-bar">
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
        position: absolute;
        left: 0;
    }
    .nav-bar{
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        display: flex;
    }
    li{
        margin-left: auto;
    }
    li div{
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #00315E;
        padding: 0px 0px;
        text-decoration: none;
    }
    .version, .view, .filter, .user{
        max-width: 100%;
        max-height: 100%;
        margin-top: 15px;
    }
    .version{
        width: 30px;
        height: 50px;
    }
    .view{
        width: 55px;
        height: 50px;
    }
    .filter{
        width: 50px;
        height: 45px; 
        margin-bottom: 5px;
    }
    .user{
        width: 50px;
        height: 50px;  
    }
    
</style>