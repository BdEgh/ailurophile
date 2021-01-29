function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const main = async () => {
  const response = await fetch('/getImages');
  const data = await response.json();
  const gallery = document.querySelector('#slides-container');
  shuffle(data).slice(0, 5).forEach(item => {
    const div = document.createElement("div");
    div.className = 'swiper-slide';
    div.innerHTML = `<div class="slide-image" style="background-image: url(/${item.imageUrl});"></div>`
    gallery.appendChild(div);
  });

  new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

document.addEventListener("DOMContentLoaded", main);