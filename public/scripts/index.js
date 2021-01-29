document.addEventListener('DOMContentLoaded', function () {
	// thumbs
	const galleryThumbs = new Swiper('.thumbs-slider', {
		spaceBetween: 12,
		slidesPerView: 5,
		navigation: {
			nextEl: '.thumbs-right',
			prevEl: '.thumbs-left',
		},
	});

	// main slider
	const mainSlider = new Swiper('.reviews__gallery', {
		loop: true,
		thumbs: {
			swiper: galleryThumbs
		},
	});
	document.querySelector('.thumbs-right').addEventListener('click', () => {
		mainSlider.slideNext();
	});
	document.querySelector('.thumbs-left').addEventListener('click', () => {
		mainSlider.slidePrev();
	});

	// games slider
	const gamesSlider = new Swiper('.games-slider', {
		slidesPerView: 7.2,
		speed: 400,
		loop: true,
	});
	document.querySelector('.games-right').addEventListener('click', () => {
		gamesSlider.slideNext();
	});
	document.querySelector('.games-left').addEventListener('click', () => {
		gamesSlider.slidePrev();
	});
});
