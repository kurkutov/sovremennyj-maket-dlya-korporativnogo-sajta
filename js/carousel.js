// Карусель взята из статьи:
// https://habr.com/ru/post/467079/ 


function Ant(crslId, options) {
	options = options === undefined ? null : options;

	let id = document.getElementById(crslId);
	if(id) {
		this.crslRoot = id
	}
	else {
		this.crslRoot = document.querySelector('.ant-carousel')
	};

	// Carousel objects
	this.crslList = this.crslRoot.querySelector('.ant-carousel-list');
	this.crslElements = this.crslList.querySelectorAll('.ant-carousel-element');
	this.crslElemFirst = this.crslList.querySelector('.ant-carousel-element');
	this.leftArrow = this.crslRoot.querySelector('div.ant-carousel-arrow-left');
	this.rightArrow = this.crslRoot.querySelector('div.ant-carousel-arrow-right');
	this.indicatorDots = this.crslRoot.querySelector('div.ant-carousel-dots');
	this.counterCurrent = this.crslRoot.querySelector('.counter .current');
	this.counterTotal = this.crslRoot.querySelector('.counter .total');

	// Initialization
	this.options = {};
	Object.assign(this.options, Ant.defaults);
	// Ant.defaults;


	if (options !== null) {
		Object.assign(this.options, options);
	} 

	Ant.initialize(this)

	// изменение ширины элемениа, при изменении ширина окна браузера
	window.addEventListener('resize', function (event) {
		Ant.prototype.resize(this)
	}, false);

};

Ant.defaults = {
	// Default options for the carousel
	elemVisible: 1, // Кол-во отображаемых элементов в карусели
	loop: true,     // Бесконечное зацикливание карусели 
	auto: true,     // Автоматическая прокрутка
	interval: 5000, // Интервал между прокруткой элементов (мс)
	speed: 750,     // Скорость анимации (мс)
	touch: true,    // Прокрутка  прикосновением
	arrows: true,   // Прокрутка стрелками
	dots: false,    // Индикаторные точки
	counter: false  // Отображаемый счетчик элементов
};

Ant.prototype.resize = function(that) {
	let elem = that.crslList.querySelector('.ant-carousel-element')
	let elemStyle = window.getComputedStyle(elem);

	that.elemWidth = elem.offsetWidth +  // Ширина элемента (без margin)
		parseInt(elemStyle.marginLeft) + parseInt(elemStyle.marginRight);

	if (that.otherResizeFunc) {
		that.otherResizeFunc();
	}

	if(!that.options.loop) {       // если нет цикла - уточнить количество точек
		that.dotsVisible = that.elemCount - that.options.elemVisible + 1;
		let diff = that.elemCount - that.currentElement;
		if (diff < that.options.elemVisible) {
			that.elemPrev(that.options.elemVisible - diff)
		}
		console.log('вот',that.currentElement, that.options.elemVisible, that.currentElement + 1 + that.options.elemVisible, that.elemCount, that.currentElement + 1 + that.options.elemVisible >= that.elemCount);
		if (that.currentElement + 1 + that.options.elemVisible <= that.elemCount) {
			that.rightArrow.classList.remove('disabled');
			that.touchNext = true;
		}
	}

	if (that.options.counter) {
		that.showCounter();
	}

}


Ant.prototype.elemPrev = function(num) {
	num = num || 1;

	if(this.options.dots) this.dotOn(this.currentElement);
	this.currentElement -= num;
	if(this.currentElement < 0) this.currentElement = this.dotsVisible-1;
	if(this.options.dots) this.dotOff(this.currentElement);

	if(!this.options.loop) {  // сдвиг вправо без цикла
		this.currentOffset += this.elemWidth*num;
		this.crslList.style.marginLeft = this.currentOffset + 'px';
		if(this.currentElement == 0) {
			// this.leftArrow.style.display = 'none';  // убираем отключение стрелок
			this.leftArrow.classList.add('disabled');
			this.touchPrev = false
		}
		// this.rightArrow.style.display = 'block';
		if (this.currentElement + this.options.elemVisible < this.elemCount) {
			this.touchNext = true
			this.rightArrow.classList.remove('disabled');
		}
		
	}
	else {                    // сдвиг вправо с циклом
		let elm, buf, this$ = this;
		for(let i=0; i<num; i++) {
			elm = this.crslList.lastElementChild;
			buf = elm.cloneNode(true);
			this.crslList.insertBefore(buf, this.crslList.firstElementChild);
			this.crslList.removeChild(elm)
		};
		this.crslList.style.marginLeft = '-' + this.elemWidth*num + 'px';
		let compStyle = window.getComputedStyle(this.crslList).marginLeft;
		this.crslList.style.cssText = 'transition:margin '+this.options.speed+'ms ease;';
		this.crslList.style.marginLeft = '0px';
		setTimeout(function() {
			this$.crslList.style.cssText = 'transition:none;'
		}, this.options.speed)
	}

	if (this.options.counter) {
		this.showCounter();
	}

};

Ant.prototype.elemNext = function(num) {
	num = num || 1;

	if(this.options.dots) this.dotOn(this.currentElement);
	this.currentElement += num;
	if(this.currentElement >= this.dotsVisible) this.currentElement = 0;
	if(this.options.dots) this.dotOff(this.currentElement);


	if(!this.options.loop) {  // сдвиг влево без цикла
		this.currentOffset -= this.elemWidth*num;
		this.crslList.style.marginLeft = this.currentOffset + 'px';

		if(this.currentElement == this.dotsVisible-1) {
			// this.rightArrow.style.display = 'none';
			this.rightArrow.classList.add('disabled');
			this.touchNext = false
		}
		// this.leftArrow.style.display = 'block'; 
		this.touchPrev = true;
		this.leftArrow.classList.remove('disabled');
	}
	else {                    // сдвиг влево с циклом
		let elm, buf, this$ = this;
		this.crslList.style.cssText = 'transition:margin '+this.options.speed+'ms ease;';
		this.crslList.style.marginLeft = '-' + this.elemWidth*num + 'px';
		setTimeout(function() {
			this$.crslList.style.cssText = 'transition:none;';
			for(let i=0; i<num; i++) {
				elm = this$.crslList.firstElementChild;
				buf = elm.cloneNode(true); this$.crslList.appendChild(buf);
				this$.crslList.removeChild(elm)
			};
			this$.crslList.style.marginLeft = '0px'
		}, this.options.speed)
	}
	if (this.options.counter) {
		this.showCounter();
	}
};

Ant.prototype.dotOn = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;'
};

Ant.prototype.dotOff = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#556; cursor:default;'
};

Ant.prototype.showCounter = function () {
	this.counterCurrent.innerHTML = this.options.elemVisible > 1 ? 
			(this.currentElement + 1) + ' - '+ (this.currentElement + this.options.elemVisible) 
			: this.currentElement  + 1;
	this.counterTotal.innerHTML = this.elemCount;
};

Ant.initialize = function(that) {
	// Constants
	that.elemCount = that.crslElements.length; // Количество элементов
	that.dotsVisible = that.elemCount;         // Число видимых точек
	let elemStyle = window.getComputedStyle(that.crslElemFirst);
	that.elemWidth = that.crslElemFirst.offsetWidth +  // Ширина элемента (без margin)
	  parseInt(elemStyle.marginLeft) + parseInt(elemStyle.marginRight);

	// Variables
	that.currentElement = 0; that.currentOffset = 0;
	that.touchPrev = true; that.touchNext = true;
	let xTouch, yTouch, xDiff, yDiff, stTime, mvTime;
	let bgTime = getTime();

	// Functions
	function getTime() {
		return new Date().getTime();
	};
	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};

	// Start initialization
	if(that.elemCount <= that.options.elemVisible) {   // Отключить навигацию
		that.options.auto = false; that.options.touch = false;
		that.options.arrows = false; that.options.dots = false;
		// that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
		that.leftArrow.classList.add('disabled'); that.rightArrow.classList.add('disabled');
	};

	if(!that.options.loop) {       // если нет цикла - уточнить количество точек
		that.dotsVisible = that.elemCount - that.options.elemVisible + 1;
		// that.leftArrow.style.display = 'none';  // отключить левую стрелку
		that.leftArrow.classList.add('disabled');  // отключить левую стрелку
		that.touchPrev = false;    // отключить прокрутку прикосновением вправо
		that.options.auto = false; // отключить автопркрутку
	}
	else if(that.options.auto) {   // инициализация автопрокруки
		setAutoScroll();
		// Остановка прокрутки при наведении мыши на элемент
		that.crslList.addEventListener('mouseenter', function() {
    	clearInterval(that.autoScroll)
    }, false);
		that.crslList.addEventListener('mouseleave', setAutoScroll, false)
	};

	if(that.options.touch) {   // инициализация прокрутки прикосновением
		that.crslList.addEventListener('touchstart', function(e) {
			xTouch = parseInt(e.touches[0].clientX);
			yTouch = parseInt(e.touches[0].clientY);
			stTime = getTime()
		}, false);
		that.crslList.addEventListener('touchmove', function(e) {
			if(!xTouch || !yTouch) return;
			xDiff = xTouch - parseInt(e.touches[0].clientX);
			yDiff = yTouch - parseInt(e.touches[0].clientY);
			mvTime = getTime();
			if(Math.abs(xDiff) > 15 && Math.abs(xDiff) > Math.abs(yDiff) && mvTime - stTime < 75) {
				stTime = 0;
				if(that.touchNext && xDiff > 0) {
					bgTime = mvTime; that.elemNext()
				}
				else if(that.touchPrev && xDiff < 0) {
					bgTime = mvTime; that.elemPrev()
				}
			}
		}, false)
	};

	if(that.options.arrows) {  // инициализация стрелок
		if(!that.options.loop) that.crslList.style.cssText =
      'transition:margin '+that.options.speed+'ms ease;';
		that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed && that.touchPrev) {
				bgTime = fnTime; that.elemPrev()
			}
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > that.options.speed && that.touchNext) {
				bgTime = fnTime; that.elemNext()
			}
		}, false)

	}
	else {
		that.leftArrow.style.display = 'none';
    	that.rightArrow.style.display = 'none'
	};

	if(that.options.dots) {  // инициализация индикаторных точек
		let sum = '', diffNum;
		for(let i=0; i<that.dotsVisible; i++) {
			sum += '<span class="ant-dot"></span>'
		};
		that.indicatorDots.innerHTML = sum;
		that.indicatorDotsAll = that.crslRoot.querySelectorAll('span.ant-dot');
		// Назначаем точкам обработчик события 'click'
		for(let n=0; n<that.dotsVisible; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function() {
				diffNum = Math.abs(n - that.currentElement);
				if(n < that.currentElement) {
					bgTime = getTime(); that.elemPrev(diffNum)
				}
				else if(n > that.currentElement) {
					bgTime = getTime(); that.elemNext(diffNum)
				}
				// Если n == that.currentElement ничего не делаем
			}, false)
		};
		that.dotOff(0);  // точка[0] выключена, остальные включены
		for(let i=1; i<that.dotsVisible; i++) {
			that.dotOn(i)
		}
	}

	if (that.options.counter) {
		that.showCounter();
	}
};

if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}



