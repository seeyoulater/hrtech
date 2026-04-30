import{n as e}from"./chunk-DnJy8xQt.js";import{h as t}from"./iframe-BU8amx9X.js";import{n,t as r}from"./Icon-Dv6YBEu-.js";var i,a,o,s,c,l;e((()=>{n(),i=t(),a=[`plus`,`trash`,`copy`,`check`,`home`,`refresh`,`logo`,`arrow-out`],o={title:`UI/Icon`,component:r,args:{name:`plus`,size:24},argTypes:{name:{control:`select`,options:a},size:{control:{type:`range`,min:12,max:64,step:2}}}},s={},c={render:()=>(0,i.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:16,padding:16},children:a.map(e=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8,color:`#1f7a4a`},children:[(0,i.jsx)(r,{name:e,size:28}),(0,i.jsx)(`code`,{style:{fontSize:12,color:`#6b6b73`},children:e})]},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    padding: 16
  }}>
      {NAMES.map(name => <div key={name} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      color: '#1f7a4a'
    }}>
          <Icon name={name} size={28} />
          <code style={{
        fontSize: 12,
        color: '#6b6b73'
      }}>{name}</code>
        </div>)}
    </div>
}`,...c.parameters?.docs?.source}}},l=[`Default`,`Gallery`]}))();export{s as Default,c as Gallery,l as __namedExportsOrder,o as default};