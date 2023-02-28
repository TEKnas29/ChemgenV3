<script>
    import { Input,InputAddon, Button, ButtonGroup, Checkbox, Heading, Select, Label, NumberInput, Toggle} from "flowbite-svelte";
    let mq = [
        { id:1, editortype:0, try:3, eb:0, ddm:0}
    ];
    let gs = [
        { id:1, editortype:0, try:0, eb:0, ddm:0}
    ];

    const editortype = [
    {value:0 ,name:"formed"},
    {value:1 ,name:"moleced"},
    {value:2 ,name:"tabed"}
    ]
    let tg=false;
    let selected;
    $: {
        console.log(tg);
    }
</script>
<div class="inpTable">
    
    <ButtonGroup>
        <Button outline color="blue">Add Question</Button>
        <Button outline color="blue">Add GS Question</Button>
        <Button outline color="blue" disabled><Checkbox>Intermediate Inst</Checkbox></Button>
        <Button outline color="blue" disabled><Checkbox>Intermediate Value</Checkbox></Button>
        <Button outline color="blue" disabled><Checkbox>Generate Num List</Checkbox></Button>
        <Button outline color="blue" disabled><Checkbox>Strike Math</Checkbox></Button>
    </ButtonGroup>
    <Heading tag="h5">Main Question</Heading>
    {#each mq as m}
    <ButtonGroup class="w-full" size="md">
        <Label>Editor: 
            <Select items={editortype} placeholder=Editor class="rounded-none w-auto" bind:value={selected}>
            </Select>
        </Label>
        <Label>Tries:
            <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </Label>
        <Label>Editbox:
            <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </Label>
        <Label>DDM:
            <input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </Label>
        <Label>I{m.id}_text1:
            <Toggle size=small class="align-baseline h-auto my-2" bind:checked={tg}></Toggle>
        </Label>
    </ButtonGroup>
    {#if tg === true}
        <Input id="input-addon-sm" type="email" placeholder="I{m.id}" class="w-full rounded-none"/>
    {/if}
      {/each}
      <Heading tag="h5">Guided Solution</Heading>
      {#each gs as g}
      <ButtonGroup class="w-full" size="sm">
          <InputAddon>GS{g.id}</InputAddon>
          <Input id="input-addon-sm" type="email" placeholder="GS{g.id}" />
        </ButtonGroup>

    {/each}
</div>