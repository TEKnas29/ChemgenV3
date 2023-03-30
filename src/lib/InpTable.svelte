<script>
    import { Input, Button, ButtonGroup, Checkbox, Heading, Select, Label,  Toggle, Hr, InputAddon} from "flowbite-svelte";


    let mq = []
    let gs = [];
    let intF = false
    let intFV = false
    let gNum = false
    let strikeM = false
    $: intermidiateFunction = (intF ? `
        <var name=IntermediateCalculations value="<i>Note</i>: For all intermediate calculations make sure to carry two extra digits when applicable and only round your final answer to the correct number of significant digits.">
        <function name=show_int_calc_instructions list={mode}>
            <if cond=("@mode;"=="static")>
                <var name=return_text value="">
            <else>
                <var name=return_text value="@IntermediateCalculations;<br/>">
            </if>
            <return value="@test;@return_text;">
        </function>
        ` : '')
    $: intermidiateFunctionValue = (intFV ? `
        <function name=extra_digit_intermediate list={num,sigfig,max_extra_digit}>
        <var name=max_extra_digit value=((@max_extra_digit;)?@max_extra_digit;:2)>
        
        <var name=count value=0>
        <var name=hdot_flag value=0>
        <for name=i value=0 cond=(@i;<=@max_extra_digit;) next=(@i; + 1)>
            <var name=num_val value=@userf.ansSigFig(@num;,(@sigfig;+@i;))>
        <if cond=(@num_val;==@num;)>
            <var name=i value=(@max_extra_digit;+1)>
        <else>
                <var name=count value=@count;+1>
        </if>
            </for>
        
        <var name=hdot_flag cond=(@count;>@max_extra_digit;) value=1>
        <var name=sigfig value=(@sigfig;+@count;-@hdot_flag;)>
        <return value={@num_val;,@sigfig;,@hdot_flag;}>
        </function>
        ` : '')
    $: generateNumListFunction = (gNum ? `
        <!--Try not to use this function according to new convention-->
        <!--Try @inst; mod <steps> in require instead-->
        <function name=generate_num_list list={start_num, end_num, step, exclude_lst}>
        <var name=num_list value={}>
        <for name=start value=@start_num cond=(@start;<=@end_num;) next=(@start;+@step;)>
        <if cond=(hasElem(@exclude_lst;,@start;)==0)>
        &(addElem(num_list,@start;));
        </if>
        </for>
        <return value=@num_list;>
        </function>
        ` : '')
    $: stikeMathFunction = (strikeM ? `
        <!-- strike function -->
        <!-- val1: Number or unit -->
        <!-- mt_ap: 0 or "" for math font, other number for Anspro -->
        <!-- mode: create variable in trunck module with any value and in TA/SM with 0 -->
        <function name=strike_function list={val1,mt_ap,mode,sp}>
        <var name=space_val value=(@sp;==1?"&sp;":"")>
        <if cond=(!@mt_ap; && !@mode;)>
            <return value="@space_val;<font color=@userf.red;><strike><font color=@userf.black;>@val1;</font></strike></font>">  	
        <else cond=(@mt_ap; && !@mode;)>
            <return value="\\\\style<'color:@userf.red;;'>;[\\\\enclose<'notation:updiagonalstrike;'>;[\\\\style<'color:;;'>;[@val1;]]]">  
        <else>
            <return value="@val1;">
        </if>
        </function>
        ` : '')
   
// Steps count Generator
    $: statementStepsList = Steps(mq,1) 
    $: resolutionStepsList = Steps(gs,2)
    function Steps(arr=[],mode=0){
         let noOfSteps = ''
         let m = mode===1 ? 'I' : 'GS'
         
         if (m !=='' && arr !== []) {
             for (let i = 1; i <= arr.length; i++) {
                if (i === 1) {
                    noOfSteps += m + i 
                }else{
                    noOfSteps += "\",\""+ m + i 
                }
                
             }
                return `<return value={"${noOfSteps}"}>`
             }
        return ``
    }
//Tries    
    $: triesModule = triesCalc(mq)
    function triesCalc(mq) {
        let tries = ''
        if (mq) {
            let stepArr = []
            for(const m of mq){
                if (m.try > 0 && m.try < 3) {
                    const step =`"I${m.id}":${m.try}`
                    stepArr.push(step)
                }
            }
            if (stepArr.length > 0) {
                tries = `
                <function name=StatementStepsTries list={}>
                    <return value=#{${stepArr.join(",")}}>
                </function>`
            }
        }
        return tries
    }
// I1/GS1 editor Generator
    $: statementSteps = getSteps(mq,1)
    $: resolutionSteps = getSteps(gs,2)
    function mediaListGen(editbox, ddm){
                            let mediaList = "html";
                            if (editbox != 0) {
                                mediaList = mediaList.concat(",ansed,ansedchem");
                            }
                            if (ddm != 0) {
                                mediaList = mediaList.concat(",UIChoice");
                            }
                            if (editbox == 0 && ddm == 0) {
                                mediaList = mediaList.concat(",checkbox");
                            }
                            return mediaList;
                            }
    function getSteps(Steps, mode) {
        let editor = '';
        for(const s of Steps){
            if (s.editortype>=0 && s.editortype !== '') {
                const stepName = (mode === 1 ? "I" : "GS") + s.id 
                const feedbacktext = mode === 1 ? `,\n\t\t\t\t\t\t\t\tfeedbacks:#{},` : ``
                const refVal = mode === 1 ? "INTERACTION" : "SOLUTION"
                const reference = `<TEXT REF=${refVal}>
                                        <p>%${stepName}_text1;</p>
                                        @iB;${editortype[s.editortype]['name']}_editor_${stepName};@iE;
                                    </TEXT>
                                    <return value="${refVal}">`
                switch (s.editortype) {
                    case 0:
                        editor +=`<!-- ***************************************${stepName}*************************************** --> 
                            <function name=StatementModule_${stepName} list={modeRequested}>
                                <var name=formed_editor_${stepName} value=@.toolLayout.createTool('formed','formed_${stepName}','editor',#{
                                    recall:text()${feedbacktext}
                                });>
                                ${reference}       
                            </function>\n`
                        break;
                    case 1:
                        const mediaList = mediaListGen(s.eb, s.ddm)
                        editor += `<var name=tabed_editor_${stepName} value=@.toolLayout.createTool('tabed','tabed_${stepName}','editor',#{
                                        recall:text(),features: #{display: #{border: "none"}},${feedbacktext}
                                        mediaList:{${mediaList}}
                                    });>
                                ${reference}`
                        break;
                    case 2:
                        editor += `<var name=moleced_editor_${stepName} value=@.toolLayout.createTool('moleced','moleced_${stepName}','editor',#{
                                    width: @userfChemistry.moleced_width["small"];,
                                    height: @userfChemistry.moleced_height["small"];,
                                    menu: "standard",
                                    features:#{
                                        input:#{
                                            bondType:{"line"}
                                            }
                                        }
                                    });>
                                    ${reference}`
                        break;
                    case 3:
                        editor += `<var name=moleced_editor_${stepName} value=@.toolLayout.createTool("moleced_manager","moleced_${stepName}","editor",#{
                                    editorMode:"mechanism",
                                    menu:"mechanism",
                                    recall:"@moleced_recall_${stepName};",
                                    extraButtons:{"moleced_plus_arrow"},
                                    features:#{
                                        input:#{bondType:{"line"}},
                                        display:#{
                                            autoCenter: true,
                                            isChangeDefaultSize: true,
                                            reactantProductWidth: 450,
                                            reactantProductHeight: 450,
                                            reactionArrowLength: 100
                                    }}})> 
                                    ${reference}`
                        break;
                    case 4:
                        editor += `<var name=moleced_editor_${stepName} value=@.toolLayout.createTool("moleced_manager","moleced_${stepName}","editor",
                                    #{
                                    editorMode:"reaction",
                                    recall: "@moleced_recall_${stepName};",
                                    width: @userfChemistry.moleced_width["small"];,
                                    height: @userfChemistry.moleced_height["small"];,
                                    menu:"standard",       
                                    extraButtons: {"moleced_plus_arrow","moleced_copy"},             
                                    features:#{
                                        input:#{bondType:{"line"}},
                                                display:#{         
                                                    autoCenter: true,                 
                                                    reactantProductWidth: 500,
                                                    reactionArrowLength: 100,                
                                                    isChangeDefaultSize: true
                                                }
                                                }
                                    })>
                                    ${reference}`
                        break;
                    case 5:
                        editor += `<var name=moleced_editor_${stepName} value=@.toolLayout.createTool("moleced_manager","moleced_${stepName}","editor",
                                    #{
                                    editorMode:"reaction",
                                    recall: "@moleced_recall_I1;",
                                    menu:"reaction",
                                    features:#{
                                                display:#{
                                                    autoCenter: true,    
                                                        reactantProductWidth: 520,
                                                    reactantProductHeight: 350,
                                                    reactionArrowLength: 100,
                                                    isChangeDefaultSize: true
                                                }
                                                }
                                    });>
                                    ${reference}`
                        break;
                
                    default:
                        break;
                } 
            } 
        }
        return editor
    }
//sourceList
    $: staticSourceList = sourceGen(mq,gs)
    function sourceGen(mq,gs) {
        let finalSourceGen = ''
        let source = ''
        if(mq.length > 0){
            for(const m of mq){
                let j = 1
                if (m.eb > 0) {  
                    if (m.editortype === 1) {
                        for (let i = 1; i <= m.eb ; i++) {  
                            source += `
                            <text ref=tabed_source_I${m.id}_${j}><object name=ansed>\\\\editbox;[]</object></text>
                            `;
                            j += 1
                        }
                    } else if (m.editortype === 0) {
                        for (let i = 1; i <= m.eb ; i++) {  
                            source += `
                            <text ref=formed_source_I${m.id}_${j}><object name=ansed returnValue=ans_returned_I${m.id}_${j}>\\\\editbox;[]</object></text>
                            `;
                            j += 1
                        }
                    } else {
                        source += ''
                    }
                }
                if (m.ddm > 0) {  
                    if (m.editortype === 1) {
                        for (let i = 1; i <= m.ddm ; i++) {  
                            source += `
                            <text ref=tabed_source_I${m.id}_${j}><object name=UIChoice>
                                    <option value="1"></option>
                                    <option value="2"></option></object></text>
                                    `;
                            j += 1
                        }
                    } else if (m.editortype === 0) {
                        for (let i = 1; i <= m.ddm ; i++) {  
                            source += `
                            <text ref=formed_source_I${m.id}_${j}><object name=UIChoice returnValue=ans_returned_I${m.id}_${j}>
                                    <option value="1"></option>
                                    <option value="2"></option></object></text>
                                    `;
                            j += 1
                        }
                    } else {
                            source += ''
                    }
                }
            }
            finalSourceGen += source 
        }
        if(gs.length > 0){
            for(const g of gs){
                let j = 1
                if (g.eb > 0) {  
                    if (g.editortype === 1) {
                        for (let i = 1; i <= g.eb ; i++) {  
                            source += `
                            <text ref=tabed_source_GS${g.id}_${j}><object name=ansed>\\\\editbox;[]</object></text>
                            `;
                            j += 1
                        }
                    } else if (g.editortype === 0) {
                        for (let i = 1; i <= g.eb ; i++) {  
                            source += `
                            <text ref=formed_source_GS${g.id}_${j}><object name=ansed returnValue=ans_returned_GS${g.id}_${j}>\\\\editbox;[]</object></text>
                            `;
                            j += 1
                        }
                    } else {
                            source += ''
                    }
                }
                if (g.ddm > 0) {  
                    if (g.editortype === 1) {
                        for (let i = 1; i <= g.ddm ; i++) {  
                            source += `
                            <text ref=tabed_source_GS${g.id}_${j}><object name=UIChoice>
                                    <option value="1"></option>
                                    <option value="2"></option></object></text>
                                    `;
                                    j += 1
                        }
                    } else if (g.editortype === 0) {
                        for (let i = 1; i <= g.ddm ; i++) {  
                            source += `
                            <text ref=formed_source_GS${g.id}_${j}><object name=UIChoice returnValue=ans_returned_GS${g.id}_${j}>
                                    <option value="1"></option>
                                    <option value="2"></option></object></text>
                                    `;
                                    j += 1
                        }
                    } else {
                            source += ''
                    }
                }
            }
            finalSourceGen += source 
        }
        return finalSourceGen
    }
    $: staticSourceAnsList = ''    
    $: staticVarsList = ''
    $: apModuleList = ''
    $: extraTeacher = ''
    $: teacherAnswer = ''
    $: teacherHTML = ''
    $: finalAP = ''

//template
    $: isl =
    `
        <def>
            <include module=userfChemistry>
            ${intermidiateFunction}${intermidiateFunctionValue}${generateNumListFunction}${stikeMathFunction}
        </def>

        <description>
        <label name=level value={}>
        <label name=curriculum value={}>
        <label name=under value={}>
        <label name=thesaurus value={}>
        </description>

        <ITEM TITLE="@Title">

        <INSTANCE>
            <integer name=inst from=1 to=10>
        </INSTANCE>
        
        <REQUIREMENT>
        </REQUIREMENT>

        <!-- *************************************** Sequence Block ***************************************-->
        <var name=item_instance_values value={"@inst;"}>
        <SEQUENCE INDEX=history>
            <SIGNATURE NAME=@autoSequenceSignatureName() VALUE="@formatAutoSequenceSignature(@item_instance_values;)">
        </SEQUENCE>

        <REQUIREMENT>
            <REQUIRES COND=@testAutoSequenceRequirement(@item_instance_values;)>
        </REQUIREMENT>

        <QUESTION>
            <function name=TrunkModule list={}>
            <def module=".">
            
                <!-- ###############################<< Styling >>###############################-->
                <var name=iB value="@userf.indent_begin();">
                <var name=iE value="@userf.indent_end();">
                <var name=nlHint value="@.newLineHint;">
                <var name=xl value="@userf.xlist();">

                <!-- ###############################<< Var >>###############################-->
                
                <!-- ###############################<< editor >>###############################-->
                ${staticSourceList}
                
                <!-- ###############################<< editor_ans >>###############################-->
                ${staticSourceAnsList}
                
            </def> 
            </function>

            <function name=StatementSteps list={}>
            ${statementStepsList}
            </function>
            ${triesModule}
            <function name=StatementModule list={}>
            <def module="."> 
            
                <!-- *************************************** Main Question ***************************************-->
                <function name=StatementModule_Main list={modeRequested}>
                <TEXT REF=part_qn>
                    <p>&(text(I1_text1));</p>
                </TEXT>
                <text ref=debug>
                    <hr>
                    <br>inst generation - &(@item_instance_values;)
                    <br>
                    <hr>
                </text>
                <TEXT REF=STATEMENT>
                    %debug;
                    <p>%Qn_text1;</p>
                    &(("@modeRequested"=="resolution" || "@modeRequested"=="gs") ? "<p>&(text(part_qn))</p>" : "");
                </TEXT>
                <return value="STATEMENT">
                </function>
                ${statementSteps}
            </def>
            </function>


            <function name=ResolutionSteps list={}>
            ${resolutionStepsList}
            </function>

            <function name=ResolutionModule list={partsRequested}>
            <def module=".">

                <!-- *************************************** Show Me ***************************************-->
                <function name=ResolutionModule_Main list={modeRequested}> 
                ${staticVarsList}
                <TEXT REF=RESOLUTION>
                    <p>%EP_text1;</p>
                </TEXT>
                <return value="RESOLUTION">
                </function>
                ${resolutionSteps}
            </def>
            </function>


            <function name=AnsproModule list={}>
            ${apModuleList}
            </function>
        
            
            <function name=TeacherModule list={partRequested,mode}>
            ${extraTeacher}
            &(teacherAnswerHash=#{};;);${teacherAnswer}
            <return value=@teacherAnswerHash>
            </function>

            <function name=HtmlTeacherModule list={partRequested}>
            <var name=iB value="">
            <var name=iE value="">
            <unvar name=teacherAnswerHTML>${teacherHTML}
            <return value="@teacherAnswerHTML">
            </function>

            <function name=HintModule list={}>
            <return value=text(Hint_text)>
            </function>
            
        </QUESTION>
        ${finalAP}
        </ITEM>
        ` 
    const editortype = [
        {value:0 ,name:"formed"},
        {value:1 ,name:"tabed"},
        {value:2 ,name:"moleced"},
        {value:3 ,name:"mechanism"},
        {value:4 ,name:"reaction w/o arrow"},
        {value:5 ,name:"reaction"},
    ]
    
    function addQ() {
        mq = [...mq, { id:++mq.length, editortype:'', try:3, eb:0, ddm:0}]
    }
    function addG() {
        gs = [...gs, { id:++gs.length, editortype:'', try:3, eb:0, ddm:0}]
    }
    // function removeQ(id) {
    //     mq = mq.filter(item => item.id !== id)
    // }
    // function removeG(id) {
    //     gs = gs.filter(item => item.id !== id)
    // }
    function liveCheker(mq,gs) {
        if (mq.length > 0) {
            for(const m of mq){
                if (m.editortype > 1) {
                    if (m.try < 0 || m.try > 3 || m.try < 3) {
                        m.try = 3
                    }
                    if (m.eb > 0) {
                        m.eb = 0
                    }
                    if (m.ddm > 0) {
                        m.ddm = 0
                    }
                    
                }
            }
        }
        if (gs.length > 0) {
             for(const g of gs){
                if (g.editortype > 1) {
                    if (g.try < 0 || g.try > 3 || g.try < 3) {
                        g.try = 3
                    }
                    if (g.eb > 0) {
                        g.eb = 0
                    }
                    if (g.ddm > 0) {
                        g.ddm = 0
                    }
                    
                }
            }
        }
    }
    export let tg=false;
    export let finalOp = {
        "isl_op":'',
        "eng_op":''
    }
    $: liveCheker(mq,gs)
    $: {
        finalOp.isl_op = isl
        finalOp.eng_op = JSON.stringify(gs)
        
    }


   
</script>
<div class="inpTable">
    
    <ButtonGroup>
        <Button outline color="blue" on:click={addQ}>Add Question</Button>
        <Button outline color="blue" on:click={addG}>Add GS Question</Button>
    </ButtonGroup>
    <ButtonGroup>
        <Checkbox class="p-1" bind:checked={intF}>Intermediate Inst </Checkbox>
        <Checkbox class="p-1" bind:checked={intFV}>Intermediate Value </Checkbox>
        <Checkbox class="p-1" bind:checked={gNum}>Generate Num List</Checkbox>
        <Checkbox class="p-1" bind:checked={strikeM}>Strike Math</Checkbox>
        <Toggle size=small class="p-1" bind:checked={tg}>Text mode</Toggle>
    </ButtonGroup>
    <Heading tag="h5">Main Question</Heading>
    <Hr/>
    {#each mq as m}
        <div class="block p-0.5">
            <ButtonGroup  size="md">
                <InputAddon>I{m.id}</InputAddon>
                <Label class="border-t">Editor:
                    <Select items={editortype} placeholder="Editor"   bind:value={m.editortype}>
                    </Select>
                </Label>
                {#if m.editortype <= 1 && m.editortype !== ''} 
                <Label class="border-t">Tries:
                    <Input type="number"  min=0 bind:value={m.try}/>
                </Label>
                <Label class="border-t">Editbox:
                    <Input type="number" min=0 bind:value={m.eb} />
                </Label>
                <Label class="border-t">DDM:
                    <Input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 min=0" min=0 bind:value={m.ddm}/>
                </Label>
                {/if}
                <!-- <Button outline color="red" on:click={removeQ(m.id)}>X</Button> -->
            </ButtonGroup>
                {#if tg === true}
                    <Input id="input-addon-sm" type="text" placeholder="I{m.id}" class="w-auto rounded-none m-0.5"/>
                {/if}
        </div>
    {/each}
    {#if  gs.length !== 0}
        <Heading tag="h5">Guided Solution</Heading>
        <Hr/>
    {/if}
      {#each gs as g}
      <div class="block p-0.5">
        <ButtonGroup size="md">
        <InputAddon >GS{g.id}</InputAddon>
        
        <Label class="border-t">Editor: 
            <Select items={editortype} placeholder=Editor class="rounded-none w-auto" bind:value={g.editortype}>
            </Select>
        </Label>
        {#if g.editortype <= 1  && g.editortype !== ''} 
            <Label class="border-t">Tries:
                <Input type="number"  min=0 bind:value={g.try}/>
            </Label>
                <Label class="border-t">Editbox:
                    <Input type="number"  min=0 bind:value={g.eb}/>
                </Label>
                <Label class="border-t">DDM:
                    <Input type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min=0 bind:value={g.ddm}/>
                </Label>
            {/if}
        <!-- <Button outline color="red" on:click={removeG(g.id)}>X</Button> -->
    </ButtonGroup>
    {#if tg === true}
        <Input id="input-addon-sm" type="text" placeholder="GS{g.id}" class="w-auto rounded-none m-0.5"/>
    {/if}
    </div>
      {/each}
</div>