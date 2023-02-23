<!-- TODO List -->
<!-- 
sp3/SN2/spdf support
+/- support may be possible 
Bonds support not possible no idea 
-->
<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { oneDark } from "@codemirror/theme-one-dark";  
  
    
    const BlackList = new  RegExp("\'(NMR|SN2|So|E2|In)\'","gm")  // Blacklist for words looklike chem formula
    let Qn=''
    let Hn=''
    let Ep=''
    $: f1 = setf1(`${Qn+Hn+Ep}`)
    $: t1 = sett1(`${Qn+Hn+Ep}`)
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
        const chemReg = new RegExp("[A-Z][a-z]?\\d*|\\((?:[^()]*(?:\\(.*\\))?[^()]*)+\\)\\d+", 'gm') // https://stackoverflow.com/questions/23602175/regex-for-parsing-chemical-formulas
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
                const nreg2 = new RegExp('[0-9]','gm')
                const nreg3 = new RegExp('\,\,','gm')
                const nreg4 = new RegExp("1\,\,","g")
                const nreg5 = new RegExp("\{","g")
                const nreg6 = new RegExp("^\{","g")
                const nreg7 = new RegExp("\,$","g")

                let x1 = x.replace(nreg1,'_').replace(nreg3,'').replace(nreg,'')
                
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
                            .replace(nreg7,'\}')
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
        const chemReg = new RegExp("[A-Z][a-z]?\\d*|\\((?:[^()]*(?:\\(.*\\))?[^()]*)+\\)\\d+", 'gm') // https://stackoverflow.com/questions/23602175/regex-for-parsing-chemical-formulas
        const nonChem = new RegExp("(\'(..))?(\')([a-z])","gm") //crazy logic but it works
        
        const qCheck = new RegExp("\'\'","gm") //double quotes checker
        const bCheck1 = new RegExp("\\(","gm") // "(" check
        const bCheck2 = new RegExp("\\)","gm") // ")" check
        const betweenQuotes = new RegExp("\'(.*?)\'",'gm') //values between quotes
        const numChk = new RegExp("(\\b\\d\\.\\d+\\b)|(\\b\\d+\\b)(°)?","gm")
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
                    wrapper = `<!-- *****************Hint************* -->\n<text ref=Hint_text1>${para}</text>`
                    break;
                case 3:
                    const pTag = new RegExp("\n\n","gm")
                    let para1 = para.replace(pTag,"</p>\n<p>")
                    wrapper = `<!-- *****************Explainantion************* -->\n<text ref=EP1_text1><p>${para1}</p></text>`
                    break;
                    
                    default:
                        break;
            }
            return wrapper
        }
        
    }

  </script>
  
  
  <div class="template">
   <div class="box1">
    <h2>Editor</h2>
    <table class="InpTable">
        <tr>
            <td class="Qp">Qn_text1:</td>
            <td><input class="inp1" bind:value={Qn} type="text"></td>
        </tr>
        <tr>
            <td class="Qp">Hint_text:</td>
            <td><input class="inp1" bind:value={Hn} type="text"></td>
        </tr>
        <tr>
            <td class="Qp">EP_text1:</td>
            <td><textarea cols="30" bind:value={Ep} rows="10" class="inp1"></textarea></td>
        </tr>
    </table>
  
  </div>
   <div class="box2">
    <div class="subbox1">
        <h2>ENG:</h2>
        <h6>Note: sp3,SN2,bonds,charge is not supported yet they will remain as it is</h6>
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
      <div class="subbox2">
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
      }}/>
      </div>
   </div>
  </div>
  <style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap");
    h2{
      color: #006466;
    }
    h6{
        color: #006466;
    }
    .template{
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
    text-align: start   ;
    min-width: 49%;
    min-height: 100%;
    height:1000px
  }
    .InpTable{
        border: 0;
    }
    tr{
        width: 200px;
    }
     td{
        width: 100px;
    }
    .Qp{
        color: #F2F79E;
        text-align: start;
        font-size: 14;
        font-family: inter;
    }
    .inp1{
        width: 600px;
        font-family: monospace;
    }
  
  </style>