const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const productFrame = document.querySelector('#product-frame');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    navigation.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

document.querySelectorAll('[data-delay]').forEach((element) => {
  element.style.setProperty('--delay', `${element.dataset.delay}ms`);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  productFrame.addEventListener('pointermove', (event) => {
    const bounds = productFrame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    productFrame.style.transform = `perspective(1100px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg)`;
  });

  productFrame.addEventListener('pointerleave', () => {
    productFrame.style.transform = 'perspective(1100px) rotateY(0) rotateX(0)';
  });
}

const modeContent = {
  comfort: {
    number: '01',
    title: 'Welcome warmth',
    description: 'Heated to your ideal 38°C the moment your presence is detected.'
  },
  refresh: {
    number: '02',
    title: 'Crisp and calm',
    description: 'A cooler seat, brighter ambient light and a more energizing clean.'
  },
  eco: {
    number: '03',
    title: 'Quiet efficiency',
    description: 'Lower standby warmth and water use while keeping every essential ready.'
  }
};

const tempValue = document.querySelector('#temp-value');
const tempLabel = document.querySelector('.temperature small');
const modeNumber = document.querySelector('#mode-number');
const modeTitle = document.querySelector('#mode-title');
const modeDescription = document.querySelector('#mode-description');

document.querySelectorAll('.mode').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    const selection = modeContent[button.dataset.mode];
    tempValue.classList.add('changing');
    modeNumber.textContent = selection.number;
    modeTitle.textContent = selection.title;
    modeDescription.textContent = selection.description;
    tempLabel.textContent = `${button.textContent.trim()} mode`;

    window.setTimeout(() => {
      tempValue.textContent = `${button.dataset.temp}°`;
      tempValue.classList.remove('changing');
    }, 140);
  });
});

document.querySelectorAll('.hotspot').forEach((hotspot) => {
  hotspot.addEventListener('click', () => {
    const matchingTitle = hotspot.dataset.feature === 'mist' ? 'Perfume-infused water mist' : 'High-PSI cleaning jet';
    const card = [...document.querySelectorAll('.feature-card')].find((item) => item.textContent.includes(matchingTitle));
    card?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => card?.animate(
      [{ outlineColor: 'rgba(107,141,255,0)' }, { outlineColor: 'rgba(107,141,255,.8)' }, { outlineColor: 'rgba(107,141,255,0)' }],
      { duration: 1100, easing: 'ease-out', outline: '1px solid' }
    ), reducedMotion ? 0 : 650);
  });
});

const dialog = document.querySelector('#tour-dialog');
const closeDialog = dialog.querySelector('.dialog-close');
const backButton = dialog.querySelector('.dialog-back');
const nextButton = dialog.querySelector('.dialog-next');
const progress = dialog.querySelector('.dialog-progress i');
const steps = [...dialog.querySelectorAll('.tour-step')];
let currentStep = 0;

function renderStep() {
  steps.forEach((step, index) => { step.hidden = index !== currentStep; });
  progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  backButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  nextButton.innerHTML = currentStep === steps.length - 1 ? 'Finish <span aria-hidden="true">✓</span>' : 'Next <span aria-hidden="true">→</span>';
}

function openTour() {
  currentStep = 0;
  renderStep();
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

function finishTour() {
  dialog.close();
  document.body.classList.remove('dialog-open');
}

document.querySelectorAll('[data-open-tour]').forEach((button) => button.addEventListener('click', openTour));
closeDialog.addEventListener('click', finishTour);
dialog.addEventListener('click', (event) => { if (event.target === dialog) finishTour(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

nextButton.addEventListener('click', () => {
  if (currentStep === steps.length - 1) finishTour();
  else { currentStep += 1; renderStep(); }
});

backButton.addEventListener('click', () => {
  if (currentStep > 0) { currentStep -= 1; renderStep(); }
});
