import { hydrate } from './microrxlib.js';
import './pipelines.js';
import blueprint from './mrx_blueprint_index.json' assert { type: 'json' };
window.__MRX_BLUEPRINT__ = blueprint;
hydrate(document.body, blueprint);
