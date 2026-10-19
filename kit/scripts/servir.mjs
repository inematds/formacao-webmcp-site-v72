// Serve a página do kit em http://127.0.0.1:<porta>/ para abrir no SEU Chrome (com a flag) ou com ?ensaio=polyfill.
import { servir } from '../lib/navegador.mjs';
const { url } = await servir();
console.log(`página do kit em ${url}`);
console.log(`ensaio com polyfill: ${url}?ensaio=polyfill`);
console.log('Ctrl+C para parar.');
