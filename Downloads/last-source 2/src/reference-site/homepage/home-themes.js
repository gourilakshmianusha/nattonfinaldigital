// Palette values come from the linked service, product and solution page themes.
const palettes={
 forest:{accent:'#27674f',ink:'#193e32',paper:'#f5f3e9',tint:'#e7ecd8',dark:'linear-gradient(135deg,#396a50,#163e31)'},
 copper:{accent:'#a56940',ink:'#482e25',paper:'#fcf5ea',tint:'#eee1cf',dark:'linear-gradient(135deg,#71472e,#482e25)'},
 cyan:{accent:'#1676a5',ink:'#132337',paper:'#edf8fc',tint:'#dceef5',dark:'linear-gradient(135deg,#103653,#071b2c)'},
 violet:{accent:'#7653bd',ink:'#322847',paper:'#f3effa',tint:'#e9e1f5',dark:'linear-gradient(135deg,#352954,#151227)'},
 emerald:{accent:'#237b61',ink:'#234b3d',paper:'#eef5ed',tint:'#dceee2',dark:'linear-gradient(135deg,#154638,#081c19)'},
 amber:{accent:'#9c6138',ink:'#453b39',paper:'#f6f1e9',tint:'#eee2d2',dark:'linear-gradient(135deg,#3c3c48,#151b26)'},
 ocean:{accent:'#2a7fa7',ink:'#183b56',paper:'#eaf5fc',tint:'#d5e9f4',dark:'linear-gradient(135deg,#1d5372,#09233e)'},
 rose:{accent:'#a34293',ink:'#412d54',paper:'#f6f0fa',tint:'#eee0f4',dark:'linear-gradient(135deg,#2e387b,#122347)'},
 agent:{accent:'#a5592e',ink:'#44352e',paper:'#f6f1ed',tint:'#ecdfd3',dark:'linear-gradient(135deg,#273c5b,#111a2b)'},
};
export function themeFor(path){
 if(path.startsWith('/services/')||path.startsWith('/industries/'))return palettes.forest;
 if(['/products/','/products/growth-os/','/products/business-os/','/products/agentic-os/','/products/ai-marketing-platform/'].includes(path))return palettes.copper;
 const key={'/products/ai-marketing-saas/':'violet','/products/whatsapp-automation/':'emerald','/products/ai-calling-agents/':'amber','/products/cloud-telephony/':'ocean','/products/rcs-messaging/':'rose','/products/ai-agents/':'agent'}[path]||'cyan';return palettes[key];
}
export function themeStyle(theme){return {'--item-accent':theme.accent,'--item-ink':theme.ink,'--item-paper':theme.paper,'--item-tint':theme.tint,'--item-dark':theme.dark};}
