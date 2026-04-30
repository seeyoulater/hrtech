import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{h as n,v as r}from"./iframe-BU8amx9X.js";import{t as i}from"./Card-bxtq4sTH.js";import{t as a}from"./Card-CM4dU1je.js";var o,s,c,l,u,d=t((()=>{o=`_grid_1pr4p_1`,s=`_collapseMobile_1pr4p_12`,c=`_collapseTabletDown_1pr4p_18`,l=`_collapseLaptopDown_1pr4p_24`,u={grid:o,collapseMobile:s,collapseTabletDown:c,collapseLaptopDown:l}}));function f({as:e=`div`,columns:t=2,collapse:n=`tabletDown`,gap:r=4,className:i,style:a,children:o}){return(0,p.createElement)(e,{className:[u.grid,n?m[n]:null,i].filter(Boolean).join(` `),style:{...a,"--grid-cols":t,"--grid-gap":`var(--space-${r})`}},o)}var p,m,h=t((()=>{p=e(r(),1),d(),m={mobile:u.collapseMobile,tabletDown:u.collapseTabletDown,laptopDown:u.collapseLaptopDown}})),g,_,v,y,b,x,S;t((()=>{h(),a(),g=n(),_={title:`Layout/Grid`,component:f,args:{columns:2,collapse:`tabletDown`,gap:4},argTypes:{columns:{control:{type:`number`,min:1,max:6}},collapse:{control:`select`,options:[`mobile`,`tabletDown`,`laptopDown`,!1]},gap:{control:{type:`number`,min:1,max:11}},as:{control:`select`,options:[`div`,`ul`,`ol`,`section`]}},render:e=>(0,g.jsx)(`div`,{style:{width:720},children:(0,g.jsx)(f,{...e,children:Array.from({length:6}).map((e,t)=>(0,g.jsxs)(i,{children:[`Item `,t+1]},t))})})},v={},y={args:{columns:3}},b={args:{columns:4,collapse:`mobile`}},x={args:{columns:3,collapse:!1},parameters:{docs:{description:{story:`Never collapses; same column count at every viewport.`}}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    columns: 3
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    columns: 4,
    collapse: 'mobile'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    columns: 3,
    collapse: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Never collapses; same column count at every viewport.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}},S=[`TwoColumn`,`ThreeColumn`,`Gallery`,`Static`]}))();export{b as Gallery,x as Static,y as ThreeColumn,v as TwoColumn,S as __namedExportsOrder,_ as default};