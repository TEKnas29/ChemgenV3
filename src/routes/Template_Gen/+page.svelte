<script>
  import CodeMirror from "svelte-codemirror-editor";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { Label, Input, Textarea, Heading, Hr, P, Mark } from 'flowbite-svelte'

  let inp = "";
  $: isl_val = inp;
  $: eng_val = inp;
</script>

 
<div class="template flex">
  <div class="basis-1/2 text-center p-10">
   <Heading tag="h2" >Template Generator:</Heading>
   
 </div>
  <div class="basis-1/2 p-10">
   <div class="subbox1">
       <Heading tag="h4">ENG:</Heading>
       <P><Mark>Note:</Mark> sp3,SN2,bonds,charge is not supported yet they will remain as it is.</P>
       <CodeMirror 
       bind:value={eng_val} 
       theme={oneDark}
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
     <Hr/>
     <div class="subbox2">
       <Heading tag="h4">ISL:</Heading>
       <CodeMirror 
       bind:value={isl_val} 
       theme={oneDark}
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
  </div>
</div>