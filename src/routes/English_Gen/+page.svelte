<!-- TODO List -->
<!-- 
sp3/SN2/spdf support
+/- support may be possible 
Bonds support not possible no idea 
struct check list
-->
<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { oneDark } from "@codemirror/theme-one-dark";  
    import { Label, Input, Textarea, Heading, Hr, P, Mark } from 'flowbite-svelte'
    
    const BlackList = new  RegExp("\'(NMR|SN2|So|E2|In|A)\'","gm")  // Blacklist for words looklike chem formula
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
        const numChk = new RegExp("(\\b\\d\\.\\d+\\b)","gm")
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

        let chk5 = chk4.replace(bCheck1,"\{")
        let chk6 = chk5.replace(bCheck2,"\}")
        let chk7_temp;
        let chk7 = '';
        if (chk7_temp = chk6.match(betweenQuotes)){
            for(const x of chk7_temp){
                const nreg = new RegExp('\'','gm')
                const nreg1 = new RegExp("(\\{|\\})","g")
                const nreg2 = new RegExp('\\d+','gm')
                const nreg3 = new RegExp('\,\,','gm')
                const nreg4 = new RegExp("1\,\,","g")
                const nreg5 = new RegExp("\{","g")
                const nreg6 = new RegExp("^\{","g")
                const nreg7 = new RegExp("\,$","g")

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
                            .replace(nreg5,'\{\,')
                            .replace(nreg6,'1,\{')
                            .replace(nreg7,'')
                chk7 += `\n<var name=chem_${x1} value=@userfChemistry.formatChemEquation({{${x2}}},1)>`
                }
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
                        case '??':
                            return `@userf.disp('&alpha;');`
                        case '??':
                            return `@userf.disp('&beta;');`
                        case '??':
                            return `@userf.disp('&gamma;');`
                        case '??':
                            return `@userf.disp('&delta;');`
                        case '??':
                            return `@userf.disp('&epsilon;');`
                        case '??':
                            return `@userf.disp('&zeta;');`
                        case '??':
                            return `@userf.disp('&eta;');`
                        case '??':
                            return `@userf.disp('&theta;');`
                        case '??':
                            return `@userf.disp('&iota;');`
                        case '??':
                            return `@userf.disp('&kappa;');`
                        case '??':
                            return `@userf.disp('&lambda;');`
                        case '??':
                            return `@userf.disp('&mu;');`
                        case '??':
                            return `@userf.disp('&nu;');`
                        case '??':
                            return `@userf.disp('&ksi;');`
                        case '??':
                            return `@userf.disp('&omicron;');`
                        case '??':
                            return `@userf.disp('&pi;');`
                        case '??':
                            return `@userf.disp('&rho;');`
                        case '??':
                            return `@userf.disp('&sigma;');`
                        case '??':
                            return `@userf.disp('&tau;');`
                        case '??':
                            return `@userf.disp('&upsilon;');`
                        case '??':
                            return `@userf.disp('&phi;');`
                        case '??':
                            return `@userf.disp('&psi;');`
                        case '??':
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
        const numChk = new RegExp("(\\b\\d\\.\\d+\\b)|(\\b\\d+\\b)(??)?","gm")
        const spChk = new RegExp("(?:  )","gm")
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

        let chk5 = chk4.replace(bCheck1,"\{")
        let chk6 = chk5.replace(bCheck2,"\}")
        let chk7 = chk6.replace(betweenQuotes,(x)=>{
            let nreg = new RegExp("\'","g")
            let nreg1 = new RegExp("(\\{|\\})","g")

            let  y = x.replace(nreg1,'_') 
            let  z = y.replace(nreg,'')
            return `@chem_${z};` 
        })
        let chk8 = symbolCheck(chk7)

        let floatArr = []
        let thousandArr = []
        let chk9 = chk8.replace(numChk,(x)=>{
            const dotChk = new RegExp("\\.","gm")
            const degChk = new RegExp('??',"gm")
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
                    let para1 = para.replace(pTag,"</p>\n<p>")
                    wrapper = `<!-- *****************Explainantion************* -->\n<text ref=EP_text1><p>${para1}</p></text>`

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
        <P><Mark>Note:</Mark> sp3,SN2,bonds,charge is not supported yet they will remain as it is.</P>
        <CodeMirror 
        bind:value={eng_val} 
        theme={oneDark}
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
      <Hr/>
      <div class="subbox2">
        <Heading tag="h4">ISL:</Heading>
        <CodeMirror 
        bind:value={isl_val} 
        theme={oneDark}
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