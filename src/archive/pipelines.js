import * as actions from './user-actions.js';
window.__MICRORX_PIPELINES__ = window.__MICRORX_PIPELINES__ || {};
window.__MICRORX_PIPELINES__['pipeline_0'] = (el, event) => {
  if (typeof actions.addTodo==='function') actions.addTodo(el, el, event);
};

window.__MICRORX_PIPELINES__['pipeline_1'] = (el, event) => {
  if (typeof actions.searchTodos==='function') actions.searchTodos(el, event, el, event);
};

window.__MICRORX_PIPELINES__['pipeline_2'] = (el, event) => {
  if (typeof actions.deleteItem==='function') actions.deleteItem(el, el, event);
};
