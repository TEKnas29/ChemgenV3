<script context="module">
  import CodeMirror from "svelte-codemirror-editor";
  
  import { html } from "@codemirror/lang-html";
  import { oneDark } from "@codemirror/theme-one-dark";
  import {  Heading, Hr } from 'flowbite-svelte'

</script>

<script>
  import InpTable from "$lib/InpTable.svelte"
  let tg = false
  let inp = {
    "isl_op":'',
    "eng_op":''
  };
  $: isl_val = inp.isl_op;
  $: eng_val = inp.eng_op;

</script>

 
<div class="template flex">
  <div class="basis-1/2 text-center p-10">
   <Heading tag="h2" >Template Generator:</Heading>
   <Hr/>
   <div class="tb p-5">
     <InpTable bind:finalOp={inp} bind:tg={tg}/>
   </div>
 </div>
  <div class="basis-1/2 p-10">
   <div>
    
     <Heading tag="h4">ISL:</Heading>
       <CodeMirror 
       bind:value={isl_val} 
       theme={oneDark}      
       lang={html()}
       styles={{
         "&": {
             color: "white",
             width: "750px",
             height: "350px",
             maxWidth: "100%",
             maxHeight: "30%",
             styleActiveLine: true,
             matchBrackets: true,  
         },
     }}/>
     </div>
     {#if tg === true}
     <div>
      <Hr/> 
        <Heading tag="h4">ENG:</Heading>
        <CodeMirror 
        bind:value={eng_val} 
        theme={oneDark}   
        lang={html()}
        lineWrapping 
        styles={{
          "&": {
            lineWrapping: true,
            color: "white",
            width: "750px",
            height: "350px",
            maxWidth: "100%",
            maxHeight: "30%",
            styleActiveLine: true,
            matchBrackets: true,        
          },
        }}/> 
     </div>
     {/if}
  </div>
</div>