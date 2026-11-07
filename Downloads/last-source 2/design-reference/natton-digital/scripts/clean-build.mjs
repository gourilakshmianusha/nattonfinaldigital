import {rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// Only reproducible output is removed; source and installed packages are kept.
for(const directory of ['dist','.ssr-build'])rmSync(fileURLToPath(new URL('../'+directory,import.meta.url)),{recursive:true,force:true});
