import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const selectList = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');

const slimSelect = new SlimSelect({
  select: '.breed-select',
});

try {
  loader.classList.remove('hidden');
  fetchBreeds().then(data => breedSelect(data));
} catch (error) {
  Notiflix.Notify.failure('Fetching error:', error);
  catInfo.innerHTML = ``;
  loader.classList.add('hidden');
  console.log(error);
}

function breedSelect(breeds) {
  const markup = breeds
    .map(({ id, name }) => {
      return `<option value="${id}">${name}</option>`;
    })
    .join('');
  selectList.innerHTML = markup;

  slimSelect.setData(Array.from(selectList.options));

  loader.classList.add('hidden');
}

selectList.addEventListener('change', async e => {
  loader.classList.remove('hidden');
  fetchCatByBreed(e.target.value)
    .then(data => catDescription(data[0]))
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!',
        error
      );
      catInfo.innerHTML = ``;
      loader.classList.add('hidden');
      console.log(error);
    });
});

function catDescription(catData) {
  const { url } = catData;
  const { description, name, temperament } = catData.breeds[0];

  catInfo.replaceChildren();

  catInfo.innerHTML = `<div class = "content">
        <h2 class = "cat-name">${name}</h2>
        <div class = "description">
          <img class = "cat-img" src="${url}" alt="${name}" />
          <p class="text">${description}</p>
          <p class ="text">Temperament: ${temperament}</p>
        </div>
    </div>`;
  loader.classList.add('hidden');
}
