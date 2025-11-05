// NASA APOD Data Source
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Select elements
const getImageBtn = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery');
const randomFactDiv = document.getElementById('randomFact');

// Space facts
const spaceFacts = [
  "Venus spins in the opposite direction of most planets.",
  "A day on Venus is longer than its year!",
  "Neutron stars can spin up to 600 times per second.",
  "One million Earths could fit inside the Sun.",
  "There are more trees on Earth than stars in the Milky Way!",
  "Space is completely silent because there’s no air for sound to travel through.",
  "The footprints on the Moon will stay there for millions of years."
];

// Show a random fact on page load
function showRandomFact() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  randomFactDiv.textContent = `💡 Did you know? ${fact}`;
}
showRandomFact();

// Button event listener
getImageBtn.addEventListener('click', () => {
  gallery.innerHTML = '<p style="text-align:center; padding:20px;">🔄 Loading space photos...</p>';

  fetch(apodData)
    .then(res => res.json())
    .then(data => renderGallery(data))
    .catch(err => {
      gallery.innerHTML = `<p style="color:red; text-align:center;">Error loading data: ${err.message}</p>`;
    });
});

// Render gallery
function renderGallery(items) {
  gallery.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('gallery-item');

    // Handle video or image
    if (item.media_type === 'video') {
      const videoThumb = document.createElement('div');
      videoThumb.style.height = '220px';
      videoThumb.style.display = 'flex';
      videoThumb.style.alignItems = 'center';
      videoThumb.style.justifyContent = 'center';
      videoThumb.style.background = '#000';
      videoThumb.style.color = '#fff';
      videoThumb.textContent = '🎥 Video — Click to view';
      card.appendChild(videoThumb);
    } else {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.title;
      card.appendChild(img);
    }

    const info = document.createElement('p');
    info.innerHTML = `<strong>${item.title}</strong><br>${item.date}`;
    card.appendChild(info);

    card.addEventListener('click', () => openModal(item));
    gallery.appendChild(card);
  });
}

// Modal view
function openModal(item) {
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close');
  closeBtn.textContent = '✕';

  const title = document.createElement('h2');
  title.textContent = item.title;

  const date = document.createElement('p');
  date.textContent = item.date;

  let media;
  if (item.media_type === 'video') {
    media = document.createElement('iframe');
    media.src = item.url;
    media.allowFullscreen = true;
  } else {
    media = document.createElement('img');
    media.src = item.hdurl || item.url;
    media.alt = item.title;
  }

  const explanation = document.createElement('p');
  explanation.textContent = item.explanation;

  modal.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(date);
  modal.appendChild(media);
  modal.appendChild(explanation);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close modal
  closeBtn.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.remove();
  });
}
