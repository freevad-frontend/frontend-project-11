import onChange from 'on-change';
import render from './render.js';

export const state = {
  feeds: [],
  form: {
    valid: true,
    error: null,
    success: false,
    isProcessing: false,
  },
  readPosts: new Set(),
  i18nextInstance: {},
  isUpdating: false,
};

export const watchedState = onChange(state, () => {
  render(watchedState);
});
