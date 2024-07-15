import onChange from 'on-change';
import render from './render.js';

export const state = {
  feeds: [],
  form: {
    valid: true,
    error: null,
    success: true,
  },
  i18nextInstance: {},
};

export const watchedState = onChange(state, () => {
  render(watchedState);
});
