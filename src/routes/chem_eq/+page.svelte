<script>
    
    import Editor from '@tinymce/tinymce-svelte';
    import CodeMirror from "svelte-codemirror-editor";
    import { html } from "@codemirror/lang-html";
    import { oneDark } from "@codemirror/theme-one-dark";  
    import { Label, Input, Textarea, Heading, Hr, P, Mark, ButtonGroup, Button, InputAddon } from 'flowbite-svelte'
    import { filterEng, setchemVAr } from '$lib/EngConverter'
    
    export let data;
    const { apiK, conf } = data
    const chemReg = new RegExp("[A-Z][a-z]?\\d*|\\([^()]*(?:\\(.*\\))?[^()]*\\)\\d+", 'gm') 
    const p_reg = new RegExp("<p.*?>","gm")
    const sup_reg = new RegExp("<sup.*?>","gm")
    const sub_reg = new RegExp("<sub.*?>","gm")
    const subs1_reg = new RegExp("(<sub>|</sub>)","gm")
    
    let inp_val= ''
    function inp_clean(inp_val) {
        let chem_arr = inp_val.split("\n")
        let finalOp = ''
        for (const ch of chem_arr) {
            let p_clean = ch.replace(p_reg,"{ ")
                            .replace("</p>"," }")
                            .replace(sup_reg,"<sup>")
                            .replace(sub_reg,"<sub>")
                            .replace(subs1_reg,"")
                            .split(" ")
            let cleaned_array = p_clean.slice(1,-1)
            
            let final_Arr = "{"
            for (const ca of cleaned_array) {
                if (ca == "+" || ca == "-") {
                    final_Arr += `,"${ca}",` 
                }else if (ca == "&rarr;"){
                    final_Arr += `,"=",` 
                } else {
                    let comp;
                    let final_arr_temp = ''
                    
                    if (ca.match(/^\d/gm)) {
                        let comp_start = ca.replace(/^\d/gm,(num) => {
                            return  `{${num},`
                        })
                        final_arr_temp += comp_start
                    } else {
                        final_arr_temp += "{"
                    } 
                    if (comp = ca.match(chemReg)) {
                        console.log(comp);
                        for (const com of comp) {
                            if (com.match(/\d/g)) {
                                final_arr_temp += com.replace(/\d/gm,(num)=>{
                                    return `,${num},`
                                })
                            } else {
                                final_arr_temp += `${com},1,`
                            }
                        }
                    }
                }
            }
            final_Arr += "}"
        }

        return finalOp
    }
    $: Ep= inp_clean(inp_val)
    $: isl_val = `<!-- ***************VAR************* -->\n${Ep}`
    
</script>
  
  
<div class="template flex">
   <div class="basis-1/2 text-center p-10">
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
   <div class="basis-1/2 p-10">
      <div class="subbox1">
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
</div>