import{j as e}from"./jsx-runtime.ClP7wGfN.js";import{r as x}from"./index.DK-fsZOb.js";const o="#0F7B8C",y="#2D4A7A",m="#E8A020",a="#1A2332",v="#64748B",S="#F7F8FA",M="#DC2626",n="#E2E8F0",N=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];function A(){return typeof document>"u"?!1:document.cookie.includes("paid=true")}function I(){return typeof sessionStorage>"u"?!1:sessionStorage.getItem("dispute_letter_used")==="true"}function E(){typeof sessionStorage<"u"&&sessionStorage.setItem("dispute_letter_used","true")}function $(i){const u=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return`${i.patientName}
[Your Address]
[City, State ZIP]
[Your Phone Number]
[Your Email Address]

${u}

Patient Services / Billing Department
${i.providerName}
[Provider Address]
[City, State ZIP]

Re: Formal Dispute of Medical Bill
Patient Name: ${i.patientName}
Bill Date: ${i.billDate}
State: ${i.state}

To Whom It May Concern:

I am writing to formally dispute charges on a medical bill dated ${i.billDate}, from ${i.providerName}.

Reason for Dispute:
${i.disputeReason}

Under applicable state and federal law, I have the right to dispute this bill and request a full review of all charges. I respectfully request the following:

1. A complete, itemized bill listing every service, procedure, supply, and corresponding billing code (CPT/ICD code) with the associated charge.

2. A written explanation of any charge I am disputing, including the medical necessity and documentation supporting each line item.

3. A correction and reprocessing of any identified billing errors, including erroneous codes, duplicate charges, or services not rendered.

4. Suspension of any collection activity and reporting to credit bureaus during the dispute review period.

I expect a written response within 30 days of receiving this letter. If I do not receive a satisfactory response, I reserve the right to file a complaint with the ${i.state} Department of Insurance, the relevant state Attorney General's office, and/or the Centers for Medicare & Medicaid Services (CMS), as applicable.

Please send all correspondence to the address listed above.

Sincerely,

${i.patientName}
[Signature]

Enclosures:
- Copy of disputed bill dated ${i.billDate}
- [Any relevant insurance EOB or prior correspondence]

Note: Send via Certified Mail with Return Receipt Requested. Keep a copy of this letter and all enclosures for your records.`}const p={width:"100%",padding:"12px 16px",border:`1px solid ${n}`,borderRadius:"10px",fontSize:14,color:a,background:"#fff",fontFamily:"DM Sans, sans-serif",outline:"none",boxSizing:"border-box"};function T(){const[i,u]=x.useState({patientName:"",providerName:"",billDate:"",disputeReason:"",state:""}),[s,C]=x.useState(""),[b,h]=x.useState(""),g=A(),l=I(),r=!g&&l;function d(t){u(f=>({...f,[t.target.name]:t.target.value}))}function j(){const{patientName:t,providerName:f,billDate:F,disputeReason:k,state:R}=i;if(!t||!f||!F||!k||!R){h("Please fill in all 5 fields before generating your letter.");return}if(r){h("You have already generated 1 free dispute letter this session. Upgrade for unlimited letters.");return}h(""),C($(i)),g||E()}function D(){s&&navigator.clipboard.writeText(s).catch(()=>{})}function w(){const t=window.open("","_blank");t&&(t.document.write(`<pre style="font-family: Georgia, serif; white-space: pre-wrap; padding: 48px; font-size: 15px; line-height: 1.7;">${s}</pre>`),t.document.close(),t.print())}const c={display:"block",fontSize:13,fontWeight:600,color:a,marginBottom:6,fontFamily:"DM Sans, sans-serif",letterSpacing:"0.01em"};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[!g&&e.jsxs("div",{style:{background:l?"#FFFBEB":"#EFF9FA",border:`1px solid ${l?"#FCD34D":n}`,borderRadius:"12px",padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:10},children:[e.jsx("svg",{style:{width:18,height:18,color:l?m:o,flexShrink:0,marginTop:2},fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),e.jsx("p",{style:{fontSize:13,color:a,margin:0},children:l?e.jsxs(e.Fragment,{children:["Free letter used. ",e.jsx("a",{href:"/api/create-checkout",style:{color:m,fontWeight:600,textDecoration:"underline"},children:"Upgrade to Complete Dispute Kit ($19)"})," for unlimited letters."]}):e.jsxs(e.Fragment,{children:[e.jsx("strong",{children:"Free tier:"})," 1 dispute letter per session. ",e.jsx("a",{href:"/#complete-kit",style:{color:o,fontWeight:500,textDecoration:"underline"},children:"Upgrade for unlimited →"})]})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("label",{style:c,children:"Patient Name *"}),e.jsx("input",{type:"text",name:"patientName",value:i.patientName,onChange:d,placeholder:"Jane Smith",style:p,disabled:r,onFocus:t=>t.target.style.borderColor=o,onBlur:t=>t.target.style.borderColor=n})]}),e.jsxs("div",{children:[e.jsx("label",{style:c,children:"Provider / Hospital Name *"}),e.jsx("input",{type:"text",name:"providerName",value:i.providerName,onChange:d,placeholder:"Acme Regional Hospital",style:p,disabled:r,onFocus:t=>t.target.style.borderColor=o,onBlur:t=>t.target.style.borderColor=n})]}),e.jsxs("div",{children:[e.jsx("label",{style:c,children:"Bill Date *"}),e.jsx("input",{type:"date",name:"billDate",value:i.billDate,onChange:d,style:p,disabled:r,onFocus:t=>t.target.style.borderColor=o,onBlur:t=>t.target.style.borderColor=n})]}),e.jsxs("div",{children:[e.jsx("label",{style:c,children:"State *"}),e.jsxs("select",{name:"state",value:i.state,onChange:d,style:{...p,background:r?S:"#fff"},disabled:r,onFocus:t=>t.target.style.borderColor=o,onBlur:t=>t.target.style.borderColor=n,children:[e.jsx("option",{value:"",children:"Select your state"}),N.map(t=>e.jsx("option",{value:t,children:t},t))]})]})]}),e.jsxs("div",{children:[e.jsx("label",{style:c,children:"Dispute Reason *"}),e.jsx("textarea",{name:"disputeReason",value:i.disputeReason,onChange:d,placeholder:"e.g., I was charged twice for the same blood test (CPT 80053). The itemized bill shows two identical charges on 01/15/2024 totaling $486. I only had one blood draw during my visit.",style:{...p,height:120,resize:"none",lineHeight:1.6},disabled:r,onFocus:t=>t.target.style.borderColor=o,onBlur:t=>t.target.style.borderColor=n})]}),b&&e.jsxs("div",{style:{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:"10px",padding:"14px 16px"},children:[e.jsx("p",{style:{fontSize:13,color:M,margin:0},children:b}),r&&e.jsx("a",{href:"/api/create-checkout",style:{display:"inline-block",marginTop:10,background:m,color:a,fontWeight:700,padding:"9px 18px",borderRadius:"8px",fontSize:13,textDecoration:"none"},children:"Get Complete Dispute Kit — $19"})]}),e.jsx("button",{onClick:j,disabled:r,style:{width:"100%",background:r?v:y,color:"#fff",fontWeight:700,padding:"15px",borderRadius:"12px",border:"none",cursor:r?"not-allowed":"pointer",fontSize:16,fontFamily:"DM Sans, sans-serif"},onMouseOver:t=>{r||(t.currentTarget.style.background="#243D66")},onMouseOut:t=>{r||(t.currentTarget.style.background=y)},children:r?"Free Letter Used — Upgrade to Continue":"Generate My Dispute Letter"}),s&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},children:[e.jsx("h2",{style:{fontWeight:700,color:a,margin:0,fontSize:18,fontFamily:"DM Sans, sans-serif"},children:"Your Dispute Letter"}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("button",{onClick:D,style:{background:S,color:a,fontWeight:500,padding:"8px 16px",borderRadius:"8px",border:`1px solid ${n}`,cursor:"pointer",fontSize:13,fontFamily:"DM Sans, sans-serif"},children:"Copy"}),e.jsx("button",{onClick:w,style:{background:y,color:"#fff",fontWeight:600,padding:"8px 16px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:13,fontFamily:"DM Sans, sans-serif"},children:"Print / Save"})]})]}),e.jsx("div",{style:{background:"#fff",border:`1px solid ${n}`,borderRadius:"14px",padding:"28px",boxShadow:"0 1px 8px rgba(0,0,0,0.05)"},children:e.jsx("pre",{style:{fontSize:14,color:a,whiteSpace:"pre-wrap",fontFamily:"Georgia, serif",lineHeight:1.8,margin:0},children:s})}),e.jsx("p",{style:{fontSize:12,color:v,textAlign:"center",margin:0},children:"This letter is a template. Review and customize as needed. Not legal advice."})]})]})}export{T as default};
