'use strict';

///////////////////////////////////////
// elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const learnMore = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const tabContainer = document.querySelector('.operations__tab-container');
const operationTabs = document.querySelectorAll('.operations__tab');
const operationContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const imagesLazy = document.querySelectorAll('img[data-src]');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnNextSlide = document.querySelector('.slider__btn--right');
const btnPrevSlide = document.querySelector('.slider__btn--left');
const maxSlides = slides.length;
let curSlide = 0;
///////////////////////////////////////////////////////////
//Modal Panel
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////////////////////////////////
//Navgating
learnMore.addEventListener('click', function () {
  sectionOne.scrollIntoView({ behavior: 'smooth' });
});
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  //matching
  if (e.target.classList.contains('nav__link')) {
    const section = e.target.getAttribute('href');
    document.querySelector(section).scrollIntoView({ behavior: 'smooth' });
  }
});
//tabs
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked.classList.contains('operations__tab')) return;
  //remove active
  operationTabs.forEach(el => el.classList.remove('operations__tab--active'));
  operationContent.forEach(el =>
    el.classList.remove('operations__content--active')
  );
  //add active
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//NavBar
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
    const logo = hovered.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== hovered) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));
//Sticky nav bar
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  treshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
//Section animation
const sectionAnimator = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionAnimator, {
  root: null,
  threshold: 0.15,
});
sections.forEach(el => {
  sectionObserver.observe(el);
  el.classList.add('section--hidden');
});
//Lazy Loading Images
const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  treshold: 0,
  rootMargin: '300px',
});
imagesLazy.forEach(el => imgObserver.observe(el));
//Slider
const goToSlide = function (slide) {
  slides.forEach(
    (el, i) => (el.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
const nextSlide = function () {
  curSlide++;
  if (curSlide > maxSlides - 1) curSlide = 0;
  goToSlide(curSlide);
  activateDot(curSlide);
};
const prevSlide = function () {
  curSlide--;
  if (curSlide < 0) curSlide = maxSlides - 1;
  goToSlide(curSlide);
  activateDot(curSlide);
};
slides.forEach((el, i) => {
  el.style.transform = `translateX(${100 * i}%)`;
});
btnNextSlide.addEventListener('click', nextSlide);
btnPrevSlide.addEventListener('click', prevSlide);

//dots
const dotsContainer = document.querySelector('.dots');
const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-set="${i}"></button>`
    );
  });
};
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(el => el.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-set="${slide}"]`)
    .classList.add('dots__dot--active');
};
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { set } = e.target.dataset;
    goToSlide(set);
    activateDot(set);
  }
});

//Keyboard change dots
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});
goToSlide(0);
createDots();
activateDot(0);
