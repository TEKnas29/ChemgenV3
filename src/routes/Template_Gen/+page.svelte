<script>
  import CodeMirror from "svelte-codemirror-editor";
  import { oneDark } from "@codemirror/theme-one-dark";

  let inp = "";
  $: isl_val = inp;
  $: eng_val = inp;
</script>

<div class="template">
  <div class="box1">
    <h2>Template Gen:</h2>
  </div>
  <div class="box2">
    <div class="subbox1">
      <h2>ISL:</h2>
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
        }}
      />
    </div>
    <div class="subbox2">
      <h2>ENG:</h2>
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
        }}
      />
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap");
  h2 {
    color: #006466;
  }

  .template {
    display: flex;
    justify-content: space-around;
    text-align: center;
    align-items: center;
  }
  .box1 {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    min-width: 49%;
    min-height: 100%;
    height: 1000px;
  }
  .box2 {
    display: flex;
    flex-direction: column;
    text-align: start;
    min-width: 49%;
    min-height: 100%;
    height: 1000px;
  }
</style>
