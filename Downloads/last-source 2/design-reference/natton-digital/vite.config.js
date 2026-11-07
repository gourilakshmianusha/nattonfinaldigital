import {defineConfig} from 'vite';
export default defineConfig(({isSsrBuild})=>({server:{allowedHosts:['terminal.local']},build:{target:'es2020',manifest:true,copyPublicDir:isSsrBuild!==true}}));
