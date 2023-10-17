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
    const start_num = new RegExp("^\\d","g")
    const states = new RegExp("\\((s|aq|l|g)\\)","g")
    const bracs = new RegExp("\\(|\\)","g")
    const charge = new RegExp("<sup>.*?<\\/sup>","g")
    

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
                    let comp,comp2,chr;
                    let final_arr_temp = ''
                    
                    if (ca.match(start_num)) {
                        let comp_start = ca.match(start_num)                  
                        final_arr_temp += "{"+comp_start[0]+","
                    } else {
                        final_arr_temp += "{"
                    } 
                    if (comp = ca.match(chemReg)) {
                        for (const com of comp) {
                            let temp_com;
                            if (temp_com = com.match(/\)\d/)) {
                                let t1 = com.replace("(","").replace(/\)\d/g,"")
                                let t2 = t1.match(chemReg)
                                let t4 = com.match(/\d$/g)
                                final_arr_temp += "{"
                                for (const t3 of t2) {
                                    if (t3.match(/\d/g)) {
                                        final_arr_temp += t3.replace(/\d/gm,(num)=>{
                                            return `,${num},`
                                        })
                                    } else {
                                        final_arr_temp += `${t3},1,`
                                    }
                                }

                                final_arr_temp += "}," + t4
                            } else {
                                if (com.match(/\d/g)) {
                                    final_arr_temp += com.replace(/\d/gm,(num)=>{
                                        return `,${num},`
                                    })
                                } else {
                                    final_arr_temp += `${com},1,`
                                }
                            }
                        }
                    if (comp2 = ca.match(states)) {
                        for (const com2 of comp2) {
                            let temp = com2.replace(bracs,"")
                            final_arr_temp += `${temp},`
                        }
                    }
                    
                    if (chr = ca.match(charge)) {
                        let temp_chr = chr[0].replace("<sup>","").replace("<\/sup>","")
                        let n
                        if (n = temp_chr.match(/\d/g)) {
                            final_arr_temp += `,${n}`
                        } else if(n = temp_chr.match(/\d\-/g)){
                            final_arr_temp += `,-${n}`
                        } else if(temp_chr.match(/\-/g)){
                            final_arr_temp += `,-1`
                        } else {
                            final_arr_temp += `,1`
                        }
                    }
                    
                    final_arr_temp += "}"
                    final_Arr += final_arr_temp.replace(",}","}").replace("\,\,","\,")

                    }
                }
            }
            final_Arr += "}"
            finalOp += final_Arr + `\n`
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