<script>
    import NavButton from "./NavButton.svelte";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
    import { DarkMode } from 'flowbite-svelte';
</script>
<Navbar let:hidden let:toggle>
    <NavBrand href="/">
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            ChemgenV3
        </span>
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavButton BtnName=Auto/>
        <NavButton BtnName="Template_Gen"/>
        <NavButton BtnName="English_Gen"/>
        <DarkMode/>
      </NavUl>
</Navbar>
