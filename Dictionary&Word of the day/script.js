const darkToggle = document.querySelector('.dark-toggle');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.querySelector('.results-container');
const wordOfDayContent = document.getElementById('wordOfDayContent');


async function fetchWord(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();
    return data[0];
  } catch (error) {
    throw error;
  }
}

//Dark mode toggle
 darkToggle.addEventListener('click', () => {
   document.body.classList.toggle('dark');
   darkToggle.setAttribute('aria-pressed', document.body.classList.contains('dark'));

});

function displayWordData(data) {
  const phonetic = data.phonetics.find(p => p.audio) || data.phonetics[0];
  const meanings = data.meanings;
  
  let html = `
    <div class="word-header">
      <h2>${data.word}</h2>
      ${phonetic?.audio ? `<button class="audio-button" onclick="playAudio('${phonetic.audio}')">▶</button>` : ''}
    </div>
  `;

  meanings.forEach(meaning => {
    html += `
      <div class="meaning">
        <p class="part-of-speech">${meaning.partOfSpeech}</p>
        <div class="section-title">Definitions</div>
        <ul class="definitions">
          ${meaning.definitions.map(def => `<li>${def.definition}</li>`).join('')}
        </ul>
        ${meaning.synonyms.length ? `
          <div class="section-title">Synonyms</div>
          <ul class="synonyms">
            ${meaning.synonyms.map(syn => `<li onclick="searchWord('${syn}')">${syn}</li>`).join('')}
          </ul>
        ` : ''}
        ${meaning.antonyms.length ? `
          <div class="section-title">Antonyms</div>
          <ul class="antonyms">
            ${meaning.antonyms.map(ant => `<li onclick="searchWord('${ant}')">${ant}</li>`).join('')}
          </ul>
        ` : ''}

      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}

// Play audio function
function playAudio(audioUrl) {
  new Audio(audioUrl).play();
}

async function searchWord(word) {
  try {
    resultsContainer.innerHTML = '<p class="loading">Searching...</p>';
    const data = await fetchWord(word);
    displayWordData(data);
  } catch (error) {
    resultsContainer.innerHTML = '<p class="error-message">Word not found. Please try another word.</p>';
  }
}

searchButton.addEventListener('click', () => {
  if (searchInput.value.trim()) {
    searchWord(searchInput.value.trim());
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && searchInput.value.trim()) {
    searchWord(searchInput.value.trim());
  }
});

// Word of the Day
async function getWordOfDay() {
  const words = ['SERENDIPITY', 'EPHEMERAL', 'UBIQUITOUS', 'MELLIFLUOUS', 'ETHEREAL', 'LUMINIOUS', 'ENIGMATIC', 'RESPLENDENT'];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  try {
    const data = await fetchWord(randomWord);
    wordOfDayContent.innerHTML = `
      <h4 style="text-transform: uppercase ;">${data.word}</h4>
      <p>Meaning: ${data.meanings[0].definitions[0].definition}</p>
    `;
  } catch (error) {
    wordOfDayContent.innerHTML = 'Failed to load word of the day';
  }
}
getWordOfDay();

