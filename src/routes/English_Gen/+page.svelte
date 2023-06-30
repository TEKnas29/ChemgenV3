<!-- TODO List -->
<!-- 
+/- support may be possible 
struct check list
Units
-->

<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { html } from "@codemirror/lang-html";
    import { oneDark } from "@codemirror/theme-one-dark";  
    import { Label, Input, Textarea, Heading, Hr, P, Mark, ButtonGroup, Button, InputAddon } from 'flowbite-svelte'
    import { filterEng, setchemVAr } from '$lib/EngConverter'

    let Qn=''
    let Hn=''
    let Ep=''
    let mq = []
    let gs = []
    $: f1 = setf1(Qn+' '+Hn+' '+Ep +' '+PartsMash)
    $: t1 = sett1(Qn+' '+Hn+' '+Ep +' '+PartsMash)
    $: n1 = setn1(Qn+' '+Hn+' '+Ep +' '+PartsMash)
    $: chemVar = setchemVAr(Qn+" "+Hn+" "+Ep+" "+PartsMash)
    $: isl_final = checkIsl(f1,t1,n1,chemVar)
    $: isl_val = `<!-- ***************VAR************* -->\n${isl_final}`
    $: Qn1 = filterEng(Qn,1);
    $: Hn1 = filterEng(Hn,2);
    $: Ep1 = filterEng(Ep,3);
    $: Parts = filterEng(JSON.stringify(mq),4)
    $: GSparts = filterEng(JSON.stringify(gs),5)
    $: PartsMash = pMashup(mq,gs)
    $: engFinal = Qn1+'\n'+ Hn1+'\n'+ Ep1 + '\n' + Parts + '\n' +GSparts
    $: eng_val = engFinal

    function checkIsl(f1,t1,n1,chemVar) {
        let final = ''
        if (f1 !=="<var name=f1 value={}>  // remove extra commas") {    
            final += f1 + "\n"
        }
        if (t1 !=="<var name=t1 value={}>  // remove extra commas") {
            final += t1 + "\n"
        }
        if(chemVar || n1){
            final += chemVar + "\n" + n1
        }
        return final
    }
    function setf1(para) {
        const numChk = new RegExp("(\\b\\d+\\.\\d+\\b)","gm")
        let f;
        let fp = "<var name=f1 value={"
        if(f =  para.match(numChk)){
            let f1 = f.filter((item, i, allItems) => {
                      return i === allItems.indexOf(item);
                    })
            for(const x of f1){
                    fp += `\n"<math>@userf.replace_comma_num(${x});</math>",`
            
            }
        }
        fp += "}>  // remove extra commas"
        return fp
    }
    function sett1(para) {
        const numChk = new RegExp("(\\b\\d+\\b)","gm")
        let t;
        let tp = "<var name=t1 value={"
        if(t =  para.match(numChk)){
            let t1 = t.filter((item, i, allItems) => {
                    if (item > 999) {
                        return i === allItems.indexOf(item);
                    }
                    })
            for(const x of t1){
                    tp += `\n"<math>@userf.replace_comma_num(@userf.add_comma_num('${x}'););</math>",`
            
            }
        }
        tp += "}>  // remove extra commas"
        return tp
    }
    function setn1(para) {
        const numChk = new RegExp("\\b\\d+\\.\\d+\\b|\\b\\d+\\b","gm")
        const flChk = new RegExp("\\b\\d+\\.\\d+\\b","gm")
        let t;

        let np = ""
        let fl_bool = false
        if(t =  para.match(numChk)){
            let n1 = t.filter((item, i, allItems) => {
                fl_bool = item.match(flChk)        
                if (item < 999 && !fl_bool) {
                        return i === allItems.indexOf(item);
                    }
                    })
            for(const x of n1){
                    np += `\n<var name=num_${x} value="<math>${x}</math>">`
            
            }
        }
        return np
    }

    function pMashup(mq,gs) {
        let finalOp = ''
        for (const m of mq) {
            finalOp += m.tx + '\n'
        }
        for (const g of gs) {
            finalOp += g.tx + '\n'
        }
        return finalOp
    }

    function addQ() {
        mq = [...mq, { id: ++mq.length, tx:'' }];
    }
    function addG() {
        gs = [...gs, { id: ++gs.length,  tx:'' }];
    }

</script>
  
  
<div class="template flex">
   <div class="basis-1/2 text-center p-10">
    <Heading tag="h2" >Editor</Heading>
    <ButtonGroup class="text-center pt-3">
      <Button outline color="blue" on:click={addQ}>Add Question</Button>
      <Button outline color="blue" on:click={addG}>Add GS Question</Button>
    </ButtonGroup>
    <div class="text-start w-full p-10 mb-6">
    <!-- Qn text -->
        <Label for='Qn' class='block mb-2'>Qn_text1:</Label>
        <Input id="Qn" size="lg" bind:value={Qn} autocomplete=off></Input>
    <!-- Part text -->
      {#if mq.length !== 0}
      <Label for='Parts' class='block mb-2'>Parts_text1:</Label>
      {/if}
      {#each mq as m}
        <div class="block p-0.5">
          <ButtonGroup class="w-full">
            <InputAddon>I{m.id}</InputAddon>
            <Input
              id="input-addon-sm"
              type="text"
              placeholder="I{m.id}"
              class="w-auto rounded-none m-0.5"
              bind:value={m.tx}
            />
          </ButtonGroup>
        </div>
      {/each}
    <!-- Hint text -->
        <Label for='Hn' class='block mb-2'>Hint_text:</Label>
        <Input id="Hn" size="lg" bind:value={Hn} autocomplete=off></Input>
    <!-- GS text -->
        {#if gs.length !== 0}
            <Label for='Gsparts' class='block mb-2'>GS_parts_text1:</Label>
        {/if}
        {#each gs as g}
            <div class="block p-0.5">
            <ButtonGroup class="w-full">
                <InputAddon>GS{g.id}</InputAddon>
                <Input
                id="input-addon-sm"
                type="text"
                placeholder="GS{g.id}"
                class="w-auto rounded-none m-0.5"
                bind:value={g.tx}
                />
            </ButtonGroup>
            </div>
        {/each}
    <!-- EP text -->
        <Label for='Ep' class='block mb-2'>Ep_text1:</Label>
        <Textarea id='Ep' cols="30" bind:value={Ep} rows="10"></Textarea>
    </div>
  
  </div>
   <div class="basis-1/2 p-10">
    <div class="subbox1">
        <Heading tag="h4">ENG:</Heading>
        <P><Mark>Note:</Mark>charges and units is not supported yet they will remain as it is.</P>
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
</div>