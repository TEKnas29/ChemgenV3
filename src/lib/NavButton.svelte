<script>
    export let BtnName = 'Error'
</script>
<div class="NavBtn">
    {#if BtnName === "Auto"}
    <a href="/">{BtnName}</a>
    {:else}
        <a href="/{BtnName}">{BtnName}</a>
    {/if }
</div>
<style>
    .NavBtn{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 360px;
        height: 40px;
        background-color: #3a015c;
        text-align: center;
        border-radius: 10px;
    }
    a{
        color: #F2F79E;
    }
</style>