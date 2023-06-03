<script>
  import Editor from '@tinymce/tinymce-svelte';
  import CodeMirror from "svelte-codemirror-editor";
  import {  oneDark } from "@codemirror/theme-one-dark";
  import { Label, Input, Textarea, Heading, Hr, P, Mark } from 'flowbite-svelte'
  import { html } from "@codemirror/lang-html";


  export let data;
  const { apiK, conf } = data

  
  let inp_val= ''
  $: isl_val= `<!-- ######################ISL##################### -->
  ${inp_val}`
  $: eng_val= `<!-- ######################ENG##################### -->
  ${inp_val}`
</script>


<div class="index flex">
  <div class="basis-1/2 text-center ">
    <Heading tag="h2" >Editor</Heading>
    <div class="text-start w-full p-10 mb-6">
      <Editor 
        apiKey={apiK}
        disabled=true
        {conf}
        bind:value={inp_val}
      />
    </div>
  </div>
  <div class="basis-1/2 p-3">
    <div class="subbox1">
        <Heading tag="h4">ENG:</Heading>
        <P><Mark>Note:</Mark>bonds,charge is not supported yet they will remain as it is.</P>
        <CodeMirror 
        bind:value={eng_val} 
        theme={oneDark}
        lineWrapping
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
      <Hr/>
      <div class="subbox2">
        <Heading tag="h4">ISL:</Heading>
        <CodeMirror 
        bind:value={isl_val} 
        theme={oneDark}
        lang={html()}
        lineWrapping
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
   </div>
 <!-- <div class="box1">
  <h2>Editor</h2>
  <Editor 
    apiKey={apiK}
    disabled=true
    {conf}
    bind:value={inp_val}
  />

 </div>
 <div class="box2">
    <div class="subbox1">
      <h2>ISL:</h2>
      <CodeMirror 
      bind:value={isl_val} 
      theme={oneDark}
      styles={{
        "&": {
            color: "white",
            width: "750px",
            height: "350px",
            maxWidth: "100%",
            maxHeight: "30%",
        },
    }}/>
    </div>
    <div class="subbox2">
      <h2>ENG:</h2>
      <CodeMirror 
      bind:value={eng_val} 
      theme={oneDark}
      styles={{
        "&": {
            color: "white",
            width: "750px",
            height: "350px",
            maxWidth: "100%",
            maxHeight: "30%",
        },
    }}/></div>
 </div> -->
</div>