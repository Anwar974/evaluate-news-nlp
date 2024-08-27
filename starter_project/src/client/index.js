import { handleSubmit } from './js/handleSubmit.js';
import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('articleForm');
    form.addEventListener('submit', handleSubmit);
});


