<script>
    import { Button } from "flowbite-svelte";
    export let BtnName = 'Error'
</script>
<div class="NavBtn">
    {#if BtnName === "Auto"}
    <!-- <a href="/">    <Button outline gradient color="purpleToBlue" disabled>{BtnName}</Button>     </a> -->
    {:else}
        <a href="/{BtnName}"> <Button outline gradient color="purpleToBlue">{BtnName}</Button> </a>
    {/if }
</div>
