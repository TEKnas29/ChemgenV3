<script>
    import Navbar from "$lib/Navbar.svelte";
</script>

<div class="main">
    <header>
        <h1>ChemgenV3</h1>
        <hr>
        <Navbar />
        <hr/>
    </header>
    <slot></slot>
    <footer>
        <sub>(maybe)</sub>Made with ❤️, by Nsta
    </footer>
</div>

<style>
@import url("https://fonts.googleapis.com/css2?family=Jua");
@import url("https://fonts.googleapis.com/css2?family=inter&display=swap");
.main{
    font-family: inter, monospace;
    background-color: #35012c;
}
h1{
    color: #6f5c3c;
    stroke: #E1BCBC;
    font-family: jua, monospace;
    font-size: 48px;
    margin: auto;
    text-align: center;
}
hr{
    border: 7px solid ;
}
footer{
    color: #6f5c3c;
    background-color: #290025;
    margin: auto;
    text-align: center;

}
footer > sub{
        font-size: 10px;
    }
</style>