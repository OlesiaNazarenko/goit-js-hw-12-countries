import countryTmp from './templates/countryTmp';
import listTmp from './templates/list.hbs'
import { alert, error, defaultModules } from '@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js'
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'
defaultModules.set(PNotifyMobile, {})
import { defaults } from '@pnotify/core'
defaults.width = '400px'
defaults.delay = '2000'
defaults.minHeight = '56px'

const wrap = document.querySelector('.wrap');
const inputCountry = document.querySelector(".countryNameInput");
const card = document.querySelector('.card')
const debounce = require('lodash.debounce');
const BASE_URL = 'https://restcountries.eu/rest/v2/name';
// export default 
function clearContainer() {
  card.innerHTML = '';
}
function onSearch(e) {
    clearContainer();
     const searchQuery = e.target.value;
     e.preventDefault();
    fetchCountries(searchQuery)

   }
function renderCountryCard(data) {
    const markup = countryTmp(data);
    card.insertAdjacentHTML('beforeend', markup);
}
function fetchCountries(searchQuery) {
    
    return fetch(`${BASE_URL}/${searchQuery}`)
        .then(
        response => {
            if (response.status === 200) {
                return response.json();
                }
                if (response.status === 404) {
                   return error({ text: 'You entered the wrong country name.Please, try again' })
                }
               
        }
    )
        .then((data) => {
            if (data.length === 1) {
                renderCountryCard(data)
            }
            if (data.length > 10) {
    
                return error({ text: 'Too many countries found. Please enter more specific value!' })
            }
            
            if (data.length > 1) {
                card.innerHTML = listTmp(data)
            }
        })
        .catch(error => { alert({ text: 'Nothing found. Please, try again' }) })

}

inputCountry.addEventListener('input', debounce(onSearch, 500));

// 