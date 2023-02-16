<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { oneDark } from "@codemirror/theme-one-dark";  
    
    function EngCheck(para) {
        if (para) {
           //code here
            return para
        }
        return ''
    }

    function filterEng(p,md=0) {
        if (!md && !p) {
            return 0
        }else{
            let para = EngCheck(p)
            let wrapper = ''
            switch (md) {
                case 1:
                    wrapper = `<text ref=Qn_text1>${para}</text>`
                    break;
                case 2:
                    wrapper = `<text ref=Hint_text1>${para}</text>`
                    break;
                case 3:
                     wrapper = `<text ref=EP1_text1>${para}</text>`
                    break;
            
                default:
                    break;
            }
            return wrapper
        }
        
    }
    let Qn=''
    let Hn=''
    let Ep=''
    $: Qn1 = filterEng(Qn,1);
    $: Hn1 = filterEng(Hn,2);
    $: Ep1 = filterEng(Ep,3);
    $: engFinal = Qn1+'\n'+ Hn1+'\n'+ Ep1
    $: eng_val = `<!-- ######################ENG##################### -->
    ${engFinal}`
  </script>
  
  
  <div class="template">
   <div class="box1">
    <h2>Editor</h2>
    <table class="InpTable">
        <tr>
            <td class="Qp">Qn_text1: 123</td>
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
      }}/>
   </div>
  </div>
  <style>
@import url("https://fonts.googleapis.com/css2?family=inter&display=swap");
    h2{
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
      justify-content: start;
      align-items: center;
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
    }
  
  </style>