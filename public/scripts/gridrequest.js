const main = async () => {
  const response = await fetch('/getImages');
  const data = await response.json();
  const gallery = document.querySelector('#galleryDiv');

  data.forEach(item => {
    let div = document.createElement("div");
    div.innerHTML = `
    <div class="item">
      <a href="/image/${item.id}">
        <div class="gallery-image" style="background-image: url(${item.imageUrl});"></div>
        <span class="caption">${item.title}</span>
      </a>
    </div>
    `
    gallery.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", main);