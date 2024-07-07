#!/usr/bin/env node

import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const validate = () => {
  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');

  const urlSchema = yup.string().url('Invalid URL').required('URL is required');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = urlInput.value.trim();
    feedbackEl.textContent = '';

    urlSchema.validate(url)
      .then((data1) => {
        feedbackEl.textContent = data1.message;
      })
      .catch((error) => {
        feedbackEl.textContent = error.message;
      });
  });
};

export default validate;
