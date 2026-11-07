import {config} from 'dotenv';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function loadServerEnvironment(root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'), target=process.env) {
  // Hosting settings win, followed by the private production file, then local defaults.
  // Resolve against the application root even when the host starts Node from elsewhere.
  config({path:[path.join(root,'.env.production'),path.join(root,'.env')],processEnv:target,override:false,quiet:true});
}
loadServerEnvironment();
