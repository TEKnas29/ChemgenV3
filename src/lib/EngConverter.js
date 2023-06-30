// Variables
const BlackList = new  RegExp("¦(NMR|SN2|So|E2|In|A|IR|To|IUPAC|By|DDM)¦","gm")  // Blacklist for words looklike chem formula
const chemReg = new RegExp("[A-Z][a-z]?\\d*|\\([^()]*(?:\\(.*\\))?[^()]*\\)\\d+", 'gm') // https://stackoverflow.com/questions/23602175/regex-for-parsing-chemical-formulas   
const nonChem = new RegExp("(¦(..))?(¦)([a-z])","gm") //crazy logic but it works(for works like "The")
const qCheck = new RegExp("¦¦","gm") //double quotes checker
const bCheck1 = new RegExp("\\(","gm") // "(" check
const bCheck2 = new RegExp("\\)","gm") // ")" check
const betweenBars = new RegExp("¦(.*?)¦",'gm') //values between quotes
const Bond1 = new RegExp("¦(-)¦","gm")
const Bond2 = new RegExp("¦(=)¦","gm")
const Bond3 = new RegExp("¦(≡)¦","gm")
const BrokenBarDetect = new RegExp('¦','gm') 
const All_bonds_with_right_bar = new RegExp("(^| )(-|=|☰|≡)¦","gm")
const All_bonds_with_left_bar = new RegExp("¦(-|=|☰|≡)( |$)","gm")
const grignard_check = new RegExp("¦?(\')¦?","gm")

//functions
// For ENG file
export function filterEng(p,md=0) {
    if (!md && !p) {
        return 0
    }else{ //quote safety
        let para = ''
        let wrapper = ''
        switch (md) {
            case 1:
                para = EngCheck(p)

                wrapper = `<!-- *****************Q-text************* -->\n<text ref=Qn_text1>${para}</text>`
                break;
            case 2:
                para = EngCheck(p)

                wrapper = `<!-- *****************Hint************* -->\n<text ref=Hint_text>${para}</text>`
                break;
            case 3:
                para = EngCheck(p)

                const pTag = new RegExp("\n","gm")
                const emptypTag = new RegExp("<p></p>","gm")
                let para1 = para.replace(pTag,"</p>\n<p>")
                let para2 = para1.replace(emptypTag,"")
                wrapper = `<!-- *****************Explainantion************* -->\n<text ref=EP_text1><p>${para2}</p></text>`
                break;
            case 4:
                const parts = JSON.parse(p)
                for(const mq of parts){
                    para = EngCheck(mq.tx)
                    wrapper += `<!-- *****************I${mq.id}************* -->\n<text ref=I${mq.id}_text1>${para}</text>\n`
                }
                break;
            case 5:
                const gsparts = JSON.parse(p)
                for(const gs of gsparts){
                    para = EngCheck(gs.tx)
                    wrapper += `<!-- *****************GS${gs.id}************* -->\n<text ref=GS${gs.id}_text1>${para}</text>\n`
                }
                break;
                
            default:
                break;
        }
        
        return wrapper
    }
    
}

function EngCheck(para) {
    if (para) {
        const finalOp = CheckAllStage1(para)
        return finalOp
    }
    return ''
}

function CheckAllStage1(para) {

    const numChk = new RegExp("(\\b\\d+\\.\\d+\\b)|(\\b\\d+\\b)(°)?","gm") //float and number check 
    const spChk = new RegExp("(?:(?!(\n|\\s\n))\\s+)","gm")
    const italiano = new RegExp("\\b(tert|cis|trans)\\b","gm")
    const sps = new RegExp("\\b(sp(2|3))|(SN2)\\b","gm")
    

    //chk1 converts CH into ¦CH¦ and every possible regex
    let chk1 = para.replace(chemReg,(x)=>{
        return `¦${x}¦`
    })
    
    //chk2 checks for logically possible chemical formulas and remove non chems
    let chk2 = chk1.replace(nonChem,(x)=>{
        return x[1]+x[2]+x[4]
    })

    // chk3 checks for seprated formulas and unites them like ¦C¦¦H2¦ by removing double broken bars
    let chk3 = chk2.replace(qCheck,"")

    // chk4 checks for blacklisted words and filters them out for future functions
    let chk4 = chk3.replace(BlackList,function (s) {
            let  z = s.replace(BrokenBarDetect,'')
            return `${z}`
          })

    // chk5 the bracket converter (=>{ , ) => }
    let chk5 = chk4.replace(bCheck1,"\{").replace(bCheck2,"\}")
    
    //chk6 the James Bonds the bond and grignard checker
    let chk6 = chk5.replace(Bond1,"-") 
                    .replace(Bond2,"=") 
                    .replace(Bond3,"☰") 
                    .replace(All_bonds_with_right_bar,(p)=>{
                        let q = p.replace(BrokenBarDetect,'')
                                .replace(' ','')
                        return `¦${q}`
                    })
                    .replace(All_bonds_with_left_bar,(p)=>{
                        let q = p.replace(BrokenBarDetect,'')
                                .replace(' ','')
                        return `${q}¦`
                    })
                    .replace(grignard_check,(p)=>{
                        let q = p.replace(BrokenBarDetect,'')
                        return `${q}¦`
                    })
                    

    //chk7 
    //remove currly
    //remove bars
    //conert bonds to nums
    //return @chem_<name/formula>;    
    let chk7 = chk6.replace(betweenBars,(x)=>{
        let curlyBackets = new RegExp("(\\{|\\})","gm")
        const nreg_bond1 = new RegExp("(-)","gm")
        const nreg_bond2 = new RegExp("(=)","gm")
        const nreg_bond3 = new RegExp("(☰|≡)","gm")
        let  y = x.replace(curlyBackets,'_') 

        let  z = y
        .replace(nreg_bond1,"1b")
        .replace(nreg_bond2,"2b")
        .replace(nreg_bond3,"3b")
        .replace(grignard_check,'g')
        .replace(BrokenBarDetect,'')

        return `@chem_${z};` 
    })
    // italicise here
            .replace(italiano,(i)=>{
                    return `<i>${i}</i>`
                })
    //sp2 sp3 and SN2
            .replace(sps,(i)=>{
                    return `@${i.toLowerCase()};`
                })
    // { = > (,  } = > )
            .replace(/\{/gm,"(")
            .replace(/\}/gm,")")

    //chk8 converts symbols to @symb_<name>;
    let chk8 = symbolCheck(chk7)

    //for numbers 
    let floatArr = []
    let thousandArr = []
    let chk9 = chk8.replace(numChk,(x)=>{
        const dotChk = new RegExp("\\.","gm")
        const degChk = new RegExp('°',"gm")
        if (x.match(dotChk)) {
            let y = `@userf.replace_comma_num(${x});`
            if (floatArr.includes(y)) {
                let count = floatArr.indexOf(y) + 1
                return `@f1[${count}];`
            }
            let count = floatArr.length + 1
            floatArr.push(y)
            return `@f1[${count}];`
        }else if (x > 999) {
            let y = `@userf.replace_comma_num(@userf.add_comma_num('${x}'));`
            if (thousandArr.includes(y)) {
                let count = thousandArr.indexOf(y) + 1
                return `@t1[${count}];`                
            }
            let count = thousandArr.length + 1
            thousandArr.push(y)
            return `@t1[${count}];`                
        }else if(x.match(degChk)){
            x = x.replace(degChk,"&deg;")
            return `@userf.disp('${x}');`                
        }else{
            return `@num_${x};`                
        }
    })
    
    const finalOp = chk9.replace(spChk," ")
    return finalOp

}

function symbolCheck(para) {
    const symReg = new RegExp("[^a-zA-Z0-9\\s\\-\\(\\)\\{\\}\\@\\_\\;]","gm") //Regex for spl chars
    if (para) {
        if (para.match(symReg)) {
            let symChk = para.replace(symReg,(x)=>{
                switch (x) {
                    case 'α':
                        return `@symb_alpha;`
                    case 'β':
                        return `@symb_beta;`
                    case 'γ':
                        return `@symb_gamma;`
                    case 'δ':
                        return `@symb_delta;`
                    case 'ε':
                        return `@symb_epsilon;`
                    case 'ζ':
                        return `@symb_zeta;`
                    case 'η':
                        return `@symb_eta;`
                    case 'θ':
                        return `@symb_theta;`
                    case 'ι':
                        return `@symb_iota;`
                    case 'κ':
                        return `@symb_kappa;`
                    case 'λ':
                        return `@symb_lambda;`
                    case 'μ':
                        return `@symb_mu;`
                    case 'ν':
                        return `@symb_nu;`
                    case 'ξ':
                        return `@symb_ksi;`
                    case 'ο':
                        return `@symb_omicron;`
                    case 'π':
                        return `@symb_pi;`
                    case 'ρ':
                        return `@symb_rho;`
                    case 'σ':
                        return `@symb_sigma;`
                    case 'τ':
                        return `@symb_tau;`
                    case 'υ':
                        return `@symb_upsilon;`
                    case 'φ':
                        return `@symb_phi;`
                    case 'ψ':
                        return `@symb_psi;`
                    case 'ω':
                        return `@symb_omega;`
                    case 'Δ':
                        return `@symb_cap_delta;`
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

// For ISL File

export function setchemVAr(para) {
    const sps = new RegExp("\\b(sp[2|3])\\b","gm")
    const sn = new RegExp("\\b(SN2)\\b","gm")

    //add bars
    let chk1 = para.replace(chemReg,(x)=>{
        return `¦${x}¦`
    })

    // remove bars from nonchems
    let chk2 = chk1.replace(nonChem,(x)=>{
        return x[1]+x[2]+x[4]
    })

    //double bar check
    let chk3 = chk2.replace(qCheck,"")

    //remove blacklisted words
    let chk4 = chk3.replace(BlackList,function (s) {
        let  z = s.replace(BrokenBarDetect,'')
        return `${z}`
    })
    
    //brackys
    let chk5 = chk4.replace(bCheck1,"\{")
    let chk6 = chk5.replace(bCheck2,"\}")
                    .replace(Bond1,"-") 
                    .replace(Bond2,"=") 
                    .replace(Bond3,"≡") 
                    .replace(All_bonds_with_right_bar,(p)=>{
                        let q = p.replace(BrokenBarDetect,'')
                                .replace(' ','')
                        return `¦${q}`
                    })
                    .replace(All_bonds_with_left_bar,(p)=>{
                        let q = p.replace(BrokenBarDetect,'')
                                .replace(' ','')
                        return `${q}¦`
                    })
                    .replace(grignard_check,(p)=>{
                        let q = p.replace(BrokenBarDetect,'')
                        return `${q}¦`
                    })
                    
    //chk7
    let chk7_temp;
    let chk7 = '';

    if (chk7_temp = chk6.match(betweenBars)) {
        const nreg_bond1 = new RegExp("(-)","gm")
        const nreg_bond2 = new RegExp("(=)","gm")
        const nreg_bond3 = new RegExp("(≡)","gm")
        for (const c7 of chk7_temp) {
            //if bonds in formula use font chemsymb
            if (c7.match(nreg_bond1) || c7.match(nreg_bond2) || c7.match(nreg_bond3) || c7.match(grignard_check)) {
                
                const nreg1 = new RegExp("(\\{|\\})","gm")
                const nreg2 = new RegExp('\\d+','gm')
                    
                let x1 = c7
                .replace(nreg1,'_')
                .replace(grignard_check,'g')
                .replace(BrokenBarDetect,'')
                .replace(nreg_bond1,"1b")
                .replace(nreg_bond2,"2b")
                .replace(nreg_bond3,"3b")
                
                let x2 = c7
                        .replace(nreg_bond1,"@userfChemistry.singlebond();")
                        .replace(nreg_bond2,"@userfChemistry.doublebond();")
                        .replace(nreg_bond3,"@userfChemistry.triplebond();")
                        .replace(grignard_check,'&prime;')
                        .replace(BrokenBarDetect,"")
                        .replace(nreg2,(p)=>{
                            let q = p.replace(BrokenBarDetect,'')
                            return `<sub>${q}</sub>`
                        })
                        .replace(BrokenBarDetect,'')
                        .replace(/\{/gm,"(")
                        .replace(/\}/gm,")")
                   
                        
                chk7 += `\n<var name=chem_${x1} value="<math><font face=chemsymb>${x2}</font></math>">`
                //else use funtion
            } else {
                
                const nreg1 = new RegExp("(\\{|\\})","g")
                const nreg2 = new RegExp('\\d+','gm')
                const nreg3 = new RegExp('\,\,','gm')
                const nreg4 = new RegExp("1\,\,","g")
                const nreg6 = new RegExp("^\{","g")
                const nreg7 = new RegExp("\,$","g")
                const nreg8 = new RegExp("\,\}","g")

                let x1 = c7
                .replace(nreg1,'_')
                .replace(nreg3,'').replace(BrokenBarDetect,'')
                
                let x2 = c7.replace(BrokenBarDetect,"")
                          .replace(nreg2,(p)=>{
                                let q = p.replace(BrokenBarDetect,'')
                                return `,${q},`
                            })
                            .replace(BrokenBarDetect,'')
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
    chk7 += symbolVar(chk6)
    const finalOp = chk7.split("\n")
                .filter((item, i, allItems) => {
                  return i === allItems.indexOf(item);
                })
                .join("\n");
    return finalOp
}
function symbolVar(para) {
    const symReg = new RegExp("[^a-zA-Z0-9\\s\\-\\(\\)\\{\\}\\@\\_\\;]","gm") //Regex for spl chars
    if (para) {
        let symvar = []
        let finalOp = ''
        if (symvar = para.match(symReg)) {
            for (const sym of symvar) {
                switch (sym) {
                    case 'α':
                        finalOp += `<var name=symb_alpha value="<math>&alpha;</math>">\n`
                        break;
                    case 'β':
                        finalOp += `<var name=symb_beta value="<math>&beta;</math>">\n`
                        break;
                    case 'γ':
                        finalOp += `<var name=symb_gamma value="<math>&gamma;</math>">\n`
                        break;
                    case 'δ':
                        finalOp += `<var name=symb_delta value="<math>&delta;</math>">\n`
                        break;
                    case 'ε':
                        finalOp += `<var name=symb_epsilon value="<math>&epsilon;</math>">\n`
                        break;
                    case 'ζ':
                        finalOp += `<var name=symb_zeta value="<math>&zeta;</math>">\n`
                        break;
                    case 'η':
                        finalOp += `<var name=symb_eta value="<math>&eta;</math>">\n`
                        break;
                    case 'θ':
                        finalOp += `<var name=symb_theta value="<math>&theta;</math>">\n`
                        break;
                    case 'ι':
                        finalOp += `<var name=symb_iota value="<math>&iota;</math>">\n`
                        break;
                    case 'κ':
                        finalOp += `<var name=symb_kappa value="<math>&kappa;</math>">\n`
                        break;
                    case 'λ':
                        finalOp += `<var name=symb_lambda value="<math>&lambda;</math>">\n`
                        break;
                    case 'μ':
                        finalOp += `<var name=symb_mu value="<math>&mu;</math>">\n`
                        break;
                    case 'ν':
                        finalOp += `<var name=symb_nu value="<math>&nu;</math>">\n`
                        break;
                    case 'ξ':
                        finalOp += `<var name=symb_ksi value="<math>&ksi;</math>">\n`
                        break;
                    case 'ο':
                        finalOp += `<var name=symb_omicron value="<math>&omicron;</math>">\n`
                        break;
                    case 'π':
                        finalOp += `<var name=symb_pi value="<math>&pi;</math>">\n`
                        break;
                    case 'ρ':
                        finalOp += `<var name=symb_rho value="<math>&rho;</math>">\n`
                        break;
                    case 'σ':
                        finalOp += `<var name=symb_sigma value="<math>&sigma;</math>">\n`
                    break;
                    case 'τ':
                        finalOp += `<var name=symb_tau value="<math>&tau;</math>">\n`
                    break;
                    case 'υ':
                        finalOp += `<var name=symb_upsilon value="<math>&upsilon;</math>">\n`
                    break;
                    case 'φ':
                        finalOp += `<var name=symb_phi value="<math>&phi;</math>">\n`
                    break;
                    case 'ψ':
                        finalOp += `<var name=symb_psi value="<math>&psi;</math>">\n`
                    break;
                    case 'ω':
                        finalOp += `<var name=symb_omega value="<math>&omega;</math>">\n`
                    break;
                    case 'Δ':
                        finalOp += `<var name=symb_cap_delta value="<math>&cap_delta;</math>">\n`
                    break;
                    default:
                        finalOp += ''
                        break
                }
        }
        return finalOp 
    }}
    return ''
}