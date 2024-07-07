// @ts-check

import Example from './Example.js';
//import { form } from './index.js';

export default () => {
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();
};
//export const urlInput = form.querySelector('#url-input');
