<script>
    import NavButton from "./NavButton.svelte";

</script>
<nav>
    <ul>
        <li><NavButton BtnName=Auto/></li>
        <li><NavButton BtnName="Template_Gen"/></li>
        <li><NavButton BtnName="English_Gen"/></li>
    </ul>
</nav>

<style >
    nav{
        background-color: #290025;
    }
    ul{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }


</style>