<script>
  import Editor from '@tinymce/tinymce-svelte';
  import CodeMirror from "svelte-codemirror-editor";
  import {  oneDark } from "@codemirror/theme-one-dark";

  export let data;
  const { apiK, conf } = data

  
  let inp_val= ''
  $: isl_val= `<!-- ######################ISL##################### -->
  ${inp_val}`
  $: eng_val= `<!-- ######################ENG##################### -->
  ${inp_val}`
</script>


<div class="index">
 <div class="box1">
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
 </div>
</div>
<style>
  h2{
    color: #006466;
  }
  .index{
    display: flex;
    justify-content: space-around;
    text-align: center;
    align-items: center;
  }
  .box1{
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    min-width: 49%;
    min-height: 100%;
    height:1000px
  }
  .box2{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-width: 49%;
    min-height: 100%;
    height:1000px
  }
 

</style>