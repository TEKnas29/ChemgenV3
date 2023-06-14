<!-- TODO List -->
<!-- 
SN2 support
+/- support may be possible 
Bonds support not possible no idea 
struct check list
Units
-->

<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { html } from "@codemirror/lang-html";
    import { oneDark } from "@codemirror/theme-one-dark";  
    import { Label, Input, Textarea, Heading, Hr, P, Mark } from 'flowbite-svelte'
    
    const BlackList = new  RegExp("\'(NMR|SN2|So|E2|In|A|IR|To|IUPAC|By|DDM)\'","gm")  // Blacklist for words looklike chem formula
    const chemReg = new RegExp("[A-Z][a-z]?\\d*|\\([^()]*(?:\\(.*\\))?[^()]*\\)\\d+", 'gm') // https://stackoverflow.com/questions/23602175/regex-for-parsing-chemical-formulas

    let Qn=''
    let Hn=''
    let Ep=''
    $: f1 = setf1(Qn+' '+Hn+' '+Ep)
    $: t1 = sett1(Qn+' '+Hn+' '+Ep)
    $: chemVar = setchemVAr(Qn+" "+Hn+" "+Ep)
    $: isl_final = checkIsl(f1,t1,chemVar)
    $: isl_val = `<!-- ***************VAR************* -->\n${isl_final}`
    $: Qn1 = filterEng(Qn,1);
    $: Hn1 = filterEng(Hn,2);
    $: Ep1 = filterEng(Ep,3);
    $: engFinal = Qn1+'\n'+ Hn1+'\n'+ Ep1
    $: eng_val = `${engFinal}`

    function checkIsl(f1,t1,chemVar) {
        let final = ''
        if (f1 !=="<var name=f1 value={}>  // remove extra commas") {    
            final += f1 + "\n"
        }
        if (t1 !=="<var name=t1 value={}>  // remove extra commas") {
            final += t1 + "\n"
        }
        if(chemVar){
            final += chemVar + "\n"
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
                    fp += `\n"@userf.replace_comma_num(${x});",`
            
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
                    tp += `\n"@userf.replace_comma_num(@userf.add_comma_num('${x}'););",`
            
            }
        }
        tp += "}>  // remove extra commas"
        return tp
    }
    function setchemVAr(para) {
        para = para.replace("\'","~") //quote safety
        const nonChem = new RegExp("(\'(..))?(\')([a-z])","gm") //crazy logic but it works
        
        const qCheck = new RegExp("\'\'","gm") //double quotes checker
        const bCheck1 = new RegExp("\\(","gm") // "(" check
        const bCheck2 = new RegExp("\\)","gm") // ")" check
        const betweenQuotes = new RegExp("\'(.*?)\'",'gm') //values between quotes
        const sps = new RegExp("\\b(sp[2|3])\\b","gm")
        const sn = new RegExp("\\b(SN2)\\b","gm")
        const Bond1 = new RegExp("(\'-\')","gm")
        const Bond2 = new RegExp("(\'=\')","gm")
        const Bond3 = new RegExp("(\'(≡)\')","gm")
        const All_bonds_with_rightquote = new RegExp("(-\')|(=\')|(≡\')","gm")
        // const All_bonds_with_leftquote = new RegExp("(\'-)|(\'=)|(\'≡)","gm")
        let chk1 = para.replace(chemReg,(x)=>{
            return `'${x}'`
        })
        let chk2 = chk1.replace(nonChem,(x)=>{
            return x[1]+x[2]+x[4]
        })
        let chk3 = chk2.replace(qCheck,"")
        let chk4 = chk3.replace(BlackList,function (s) {
        let nreg = new RegExp("\'","gm")
        let  z = s.replace(nreg,'')
        return `${z}`
        })

        let chk5 = chk4.replace(bCheck1,"\{")
        let chk6 = chk5.replace(bCheck2,"\}")
        let chk7_temp;
        let chk7 = '';
        if (chk6.match(Bond1) || chk6.match(Bond2) || chk6.match(Bond3)) {
            let nreg = new RegExp("\'","gm")
            let chk6_bonded = chk6.replace(Bond1,"-") 
                                .replace(Bond2,"=") 
                                .replace(Bond3,"≡") 
                                .replace(All_bonds_with_rightquote,(p)=>{
                                    let q = p.replace(nreg,'')
                                    return `\'${q}`
                                })
                                // .replace(All_bonds_with_leftquote,(p)=>{
                                //     let q = p.replace(nreg,'')
                                //     return `${q}\'`
                                // })
                            console.log(chk6_bonded);
            if (chk7_temp = chk6_bonded.match(betweenQuotes)){
                for(const x of chk7_temp){
                    const nreg1 = new RegExp("(\\{|\\})","g")
                    const nreg2 = new RegExp('\\d+','gm')
                    const nreg_bond1 = new RegExp("(-)","gm")
                    const nreg_bond2 = new RegExp("(=)","gm")
                    const nreg_bond3 = new RegExp("(☰|≡)","gm")
                        
                    let x1 = x
                    .replace(nreg1,'_')
                    .replace(nreg,'')
                    .replace(nreg_bond1,"1")
                    .replace(nreg_bond2,"2")
                    .replace(nreg_bond3,"3")
                    
                    let x2 = x.replace(nreg,"")
                              .replace(nreg_bond1,"@userfChemistry.singlebond();")
                              .replace(nreg_bond2,"@userfChemistry.doublebond();")
                              .replace(nreg_bond3,"@userfChemistry.triplebond();")
                              .replace(nreg2,(p)=>{
                                    let q = p.replace(nreg,'')
                                    return `<sub>${q}</sub>`
                                })
                                .replace(nreg,'')
                    chk7 += `\n<var name=chem_${x1} value="<math><font face=chemsymb>${x2}</font></math>">`
                    }
                    
            }
        } else {
            if (chk7_temp = chk6.match(betweenQuotes)){
                for(const x of chk7_temp){
                    const nreg = new RegExp('\'','gm')
                    const nreg1 = new RegExp("(\\{|\\})","g")
                    const nreg2 = new RegExp('\\d+','gm')
                    const nreg3 = new RegExp('\,\,','gm')
                    const nreg4 = new RegExp("1\,\,","g")
                    const nreg6 = new RegExp("^\{","g")
                    const nreg7 = new RegExp("\,$","g")
                    const nreg8 = new RegExp("\,\}","g")
    
                    let x1 = x
                    .replace(nreg1,'_')
                    .replace(nreg3,'').replace(nreg,'')
                    
                    let x2 = x.replace(nreg,"")
                              .replace(nreg2,(p)=>{
                                    let q = p.replace(nreg,'')
                                    return `,${q},`
                                })
                                .replace(nreg,'')
                                .replace(nreg3,'\,')
                                .replace(chemReg,function (p) {        
                                    return `${p},1,`
                                })
                                .replace(nreg4,'')
                                .replace(nreg6,'1,\{')
                                .replace(nreg7,'')
                                .replace(nreg8,'\}')
                    chk7 += `\n<var name=chem_${x1} value=@userfChemistry.formatChemEquation({{${x2}}},1)>`
                    }
                    
            }
        }
        let chk8
        if (chk8 = chk6.match(sps)) {
            for(const x of chk8){
                let x2 = x.split('').filter(v => /\d/.test(v))
                chk7 += `\n<var name=${x} value="<math>sp<sup>${x2}</sup></math>">`
            }
            
        }
        let chk9
        if (chk9 = chk6.match(sn)) {
                chk7 += `\n<var name=sn2 value="<math><font face=text>S<sub>N</sub>2</font></math>">`   
        }
    
        const finalOp = chk7.split("\n")
                    .filter((item, i, allItems) => {
                      return i === allItems.indexOf(item);
                    })
                    .join("\n");
        return finalOp
    }

    function symbolCheck(para) {
        const symReg = new RegExp("[^a-zA-Z0-9\\s\\-\\(\\)\\{\\}\\@\\_\\;]","gm") //Regex for spl chars
        if (para) {
            if (para.match(symReg)) {
                let symChk = para.replace(symReg,(x)=>{
                    switch (x) {
                        case 'α':
                            return `@userf.disp('&alpha;');`
                        case 'β':
                            return `@userf.disp('&beta;');`
                        case 'γ':
                            return `@userf.disp('&gamma;');`
                        case 'δ':
                            return `@userf.disp('&delta;');`
                        case 'ε':
                            return `@userf.disp('&epsilon;');`
                        case 'ζ':
                            return `@userf.disp('&zeta;');`
                        case 'η':
                            return `@userf.disp('&eta;');`
                        case 'θ':
                            return `@userf.disp('&theta;');`
                        case 'ι':
                            return `@userf.disp('&iota;');`
                        case 'κ':
                            return `@userf.disp('&kappa;');`
                        case 'λ':
                            return `@userf.disp('&lambda;');`
                        case 'μ':
                            return `@userf.disp('&mu;');`
                        case 'ν':
                            return `@userf.disp('&nu;');`
                        case 'ξ':
                            return `@userf.disp('&ksi;');`
                        case 'ο':
                            return `@userf.disp('&omicron;');`
                        case 'π':
                            return `@userf.disp('&pi;');`
                        case 'ρ':
                            return `@userf.disp('&rho;');`
                        case 'σ':
                            return `@userf.disp('&sigma;');`
                        case 'τ':
                            return `@userf.disp('&tau;');`
                        case 'υ':
                            return `@userf.disp('&upsilon;');`
                        case 'φ':
                            return `@userf.disp('&phi;');`
                        case 'ψ':
                            return `@userf.disp('&psi;');`
                        case 'ω':
                            return `@userf.disp('&omega;');`
                        default:
                            return x
                            break;
                    }
                })
                return symChk
            }
            return para 
        }
        return 
    }

    function CheckAllStage1(para) {
        const nonChem = new RegExp("(\'(..))?(\')([a-z])","gm") //crazy logic but it works
        
        const qCheck = new RegExp("\'\'","gm") //double quotes checker
        const bCheck1 = new RegExp("\\(","gm") // "(" check
        const bCheck2 = new RegExp("\\)","gm") // ")" check
        const betweenQuotes = new RegExp("\'(.*?)\'",'gm') //values between quotes
        const numChk = new RegExp("(\\b\\d+\\.\\d+\\b)|(\\b\\d+\\b)(°)?","gm") //float and number check 
        const spChk = new RegExp("(?:(?!(\n|\\s\n))\\s+)","gm")
        const italiano = new RegExp("\\b(tert|cis|trans)\\b","gm")
        const sps = new RegExp("\\b(sp[2|3])|(SN2)\\b","gm")
        const Bond1 = new RegExp("\'(-)\'","gm")
        const Bond2 = new RegExp("\'(=)\'","gm")
        const Bond3 = new RegExp("\'(☰|≡)\'","gm")
        const All_bonds_with_rightquote = new RegExp("(-\')|(=\')|(☰\')|(≡\')","gm")
        // const All_bonds_with_leftquote = new RegExp("(\'-)|(\''=)|(\'☰)|(\'≡)","gm")
        let chk1 = para.replace(chemReg,(x)=>{
            return `'${x}'`
        })
        let chk2 = chk1.replace(nonChem,(x)=>{
            return x[1]+x[2]+x[4]
        })
        let chk3 = chk2.replace(qCheck,"")
        let chk4 = chk3.replace(BlackList,function (s) {
        let nreg = new RegExp("\'","g")
        let  z = s.replace(nreg,'')
        return `${z}`
      })
      const nreg = new RegExp('\'','gm')
        let chk5 = chk4.replace(bCheck1,"\{")
        let chk6 = chk5.replace(bCheck2,"\}")
                        .replace(Bond1,"-") 
                        .replace(Bond2,"=") 
                        .replace(Bond3,"☰") 
                        .replace(All_bonds_with_rightquote,(p)=>{
                            let q = p.replace(nreg,'')
                            return `\'${q}`
                        })
                        // .replace(All_bonds_with_leftquote,(p)=>{
                        //     let q = p.replace(nreg,'')
                        //     return `${q}\'`
                        // })
        
                    
        let chk7 = chk6.replace(betweenQuotes,(x)=>{
            let nreg = new RegExp("\'","g")
            let nreg1 = new RegExp("(\\{|\\})","g")
            const nreg_bond1 = new RegExp("(-)","gm")
            const nreg_bond2 = new RegExp("(=)","gm")
            const nreg_bond3 = new RegExp("(☰|≡)","gm")
            let  y = x.replace(nreg1,'_') 
            let  z = y.replace(nreg,'')
                        .replace(nreg_bond1,"1")
                        .replace(nreg_bond2,"2")
                        .replace(nreg_bond3,"3")
            return `@chem_${z};` 
        })
                        .replace(italiano,(i)=>{
                                return `<i>${i}</i>`
                            })
                        .replace(sps,(i)=>{
                                return `@${i.toLowerCase()};`
                            })
                        .replace(/\{/gm,"(")
                        .replace(/\}/gm,")")
        let chk8 = symbolCheck(chk7)

        let floatArr = []
        let thousandArr = []
        let chk9 = chk8.replace(numChk,(x)=>{
            const dotChk = new RegExp("\\.","gm")
            const degChk = new RegExp('°',"gm")
            if (x.match(dotChk)) {
                let y = `@userf.replace_comma_num(${x});`
                if (floatArr.includes(y)) {
                    let count = floatArr.indexOf(y) + 1
                    return `@userf.disp('@f1[${count}];');`
                }
                f1 += y
                let count = floatArr.length + 1
                floatArr.push(y)
                return `@userf.disp('@f1[${count}];');`
            }else if (x > 999) {
                let y = `@userf.replace_comma_num(@userf.add_comma_num('${x}'));`
                if (thousandArr.includes(y)) {
                    let count = thousandArr.indexOf(y) + 1
                    return `@userf.disp('@t1[${count}];');`                
                }
                t1 += y
                let count = thousandArr.length + 1
                thousandArr.push(y)
                return `@userf.disp('@t1[${count}];');`                
            }else if(x.match(degChk)){
                x = x.replace(degChk,"&deg;")
                return `@userf.disp('${x}');`                
            }else{
                return `@userf.disp('${x}');`                

            }
        })
        
        const finalOp = chk9.replace(spChk," ")
        return finalOp
    }
    
    function EngCheck(para) {
        if (para) {
            const finalOp = CheckAllStage1(para)
            return finalOp
        }
        return ''
    }
    
    function filterEng(p,md=0) {
        if (!md && !p) {
            return 0
        }else{
            p = p.replace("\'","~") //quote safety
            let para = EngCheck(p).replace("~","\'")
            let wrapper = ''
            switch (md) {
                case 1:
                    wrapper = `<!-- *****************Q-text************* -->\n<text ref=Qn_text1>${para}</text>`
                    break;
                case 2:
                    wrapper = `<!-- *****************Hint************* -->\n<text ref=Hint_text>${para}</text>`
                    break;
                case 3:
                    const pTag = new RegExp("\n","gm")
                    const emptypTag = new RegExp("<p></p>","gm")
                    let para1 = para.replace(pTag,"</p>\n<p>")
                    let para2 = para1.replace(emptypTag,"")
                    wrapper = `<!-- *****************Explainantion************* -->\n<text ref=EP_text1><p>${para2}</p></text>`

                    break;
                    
                    default:
                        break;
            }
            return wrapper
        }
        
    }

</script>
  
  
<div class="template flex">
   <div class="basis-1/2 text-center p-10">
    <Heading tag="h2" >Editor</Heading>
    <div class="text-start w-full p-10 mb-6">
        <Label for='Qn' class='block mb-2'>Qn_text1:</Label>
        <Input id="Qn" size="lg" bind:value={Qn} autocomplete=off></Input>
        <Label for='Hn' class='block mb-2'>Hint_text:</Label>
        <Input id="Hn" size="lg" bind:value={Hn} autocomplete=off></Input>
        <Label for='Ep' class='block mb-2'>Ep_text1:</Label>
        <Textarea id='Ep' cols="30" bind:value={Ep} rows="10"></Textarea>
    </div>
  
  </div>
   <div class="basis-1/2 p-10">
    <div class="subbox1">
        <Heading tag="h4">ENG:</Heading>
        <P><Mark>Note:</Mark>right open bonds,charge is not supported yet they will remain as it is.</P>
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