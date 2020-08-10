// Адаптивное меню
const burger = document.getElementById('burger-button');
const nav = document.getElementById('nav');
let time = 300;

burger.onclick = function() {
	let absoluteHeight = nav.scrollHeight;
	let height = nav.clientHeight;
	if (height > 0) {
		nav.style.height = 0 + 'px';
	} else {
		nav.style.height = absoluteHeight + 'px';
	}
}


new Ant(); // баннер
new Ant('services-carousel'); // услуги
// feedback
const feedbackCarouselOptions = {
	elemVisible: 3, // Кол-во отображаемых элементов в карусели
	loop: false,     // Бесконечное зацикливание карусели 
	auto: false,     // Автоматическая прокрутка
	counter: true
}
let width = document.documentElement.clientWidth;
if (width <= 768) {
	feedbackCarouselOptions.elemVisible = 1;
} else if (width > 768 && width <= 992) {
	feedbackCarouselOptions.elemVisible = 2;
} else {
	feedbackCarouselOptions.elemVisible = 3;
}

const feedbackCarousel = new Ant('feedback-carousel', feedbackCarouselOptions);
feedbackCarousel.otherResizeFunc = function() {

	let width = document.documentElement.clientWidth;

	if (width < 768) {
		feedbackCarousel.options.elemVisible = 1;
	} else if (width > 768 && width < 992) {
		feedbackCarousel.options.elemVisible = 2;
	} else {
		feedbackCarousel.options.elemVisible = 3;
	}

}


function footerMenuHundler(id) {
	let foterMenuButton = document.querySelector('#' + id + ' .menu-header');
	foterMenuButton.onclick = function() {
		let width = document.documentElement.clientWidth;
		if (width <= 768) {
			let nav = document.querySelector('#' + id + ' ul.nav-menu');
			let absoluteHeight = nav.scrollHeight;
			let height = nav.clientHeight;
			let triangle = document.querySelector('#' + id + ' .triangle');
			if (height > 0) {
				nav.style.height = 0 + 'px';
				triangle.classList.remove('active');
			} else {
				nav.style.height = absoluteHeight + 'px';
				triangle.classList.add('active');
			}	
		}
		
	}
}

new footerMenuHundler('product-munu');
new footerMenuHundler('learn-munu');
new footerMenuHundler('company-munu');




