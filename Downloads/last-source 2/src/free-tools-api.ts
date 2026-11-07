import {growthRequest} from './growth/client';
import {toolById} from './growth/registry.mjs';
import {createRequestId} from './utils/requestId.mjs';

export function toolInputs(id: string, values: Record<string, any>, currency: string) {
  const definition = toolById[id];
  if (!definition) throw new Error('Choose an available tool.');
  const inputs: Record<string, any> = {currency};
  for (const field of definition.fields) {
    const value = values[field.key];
    if (field.type === 'number') {
      if (value === '' || value == null || !Number.isFinite(Number(value))) throw new Error(`Enter a valid value for ${field.label}.`);
      inputs[field.key] = Number(value);
    } else inputs[field.key] = value;
  }
  return inputs;
}

export function createToolRunner(request = growthRequest) {
  let current: {snapshot: string; id: string; pending?: Promise<any>} | undefined;
  return (id: string, values: Record<string, any>, currency: string) => {
    const inputs = toolInputs(id, values, currency);
    const snapshot = JSON.stringify({id, inputs});
    if (!current || current.snapshot !== snapshot) current = {snapshot, id:createRequestId()};
    const run = current;
    if (!run.pending) run.pending = Promise.resolve().then(() => request(`/api/tools/${id}/run`, {
      method:'POST', body:JSON.stringify({requestId:run.id, inputs}),
    })).then(response => {
      if (!response.result || !response.submissionId) throw new Error('The tool did not return a saved result. Please try again.');
      return response;
    }).catch(error => {
      run.pending = undefined;
      if (error.code === 'previous_request_failed' || (error.status && error.status !== 409)) {
        if (current === run) current = undefined;
      }
      throw error;
    });
    return run.pending;
  };
}

/** Adapt saved API results to the existing ZIP result components. */
export function toolPresentation(response: any) {
  const result = response.result;
  const metric = (item: any) => ({...item, unit:({currency:'money', ratio:'multiple'} as Record<string,string>)[item.unit] || item.unit});
  const tables = ['scenarios','allocations','comparison','labMetrics','cashFlow'].flatMap(key => {
    const rows = result[key];
    if (!Array.isArray(rows) || !rows.length) return [];
    const columns = Object.keys(rows[0]);
    return [{title:({scenarios:'Scenario comparison', allocations:'Channel allocation', comparison:'Long-term comparison', labMetrics:'Observed Lighthouse metrics', cashFlow:'Monthly cash flow'} as Record<string,string>)[key], columns, rows:rows.map(row => columns.map(column => {
      const value = row[column];
      return value == null ? 'Not available' : typeof value === 'object' ? JSON.stringify(value) : value;
    }))}];
  });
  return {
    ...result, metrics:(result.metrics || []).map(metric), tables,
    domains:result.readiness?.domains?.filter((domain: any) => domain.score !== null).map((domain: any) => ({name:domain.domain, score:domain.score})),
    methodology:result.methodology || [],
    notes:[...(result.warnings || []), ...(result.assumptions || []), ...(result.dataSources || [])],
    recommendations:[...(result.recommendations || []), ...(result.readiness?.quickWins || [])],
    report:response.report, submissionId:response.submissionId,
  };
}
