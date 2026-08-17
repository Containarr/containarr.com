const typingService = document.querySelector('#typing-service');
const typingCursor = document.querySelector('.typing-cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const services = [
  { name: 'plex', color: '#e5a00d' },
  { name: 'sonarr', color: '#52a2c9' },
  { name: 'radarr', color: '#f2cf42' },
  { name: 'homey', color: '#1da1f2' },
  { name: 'jellyfin', color: '#aa5cc3' },
  { name: 'qbittorrent', color: '#4d9be8' },
  { name: 'wg-easy', color: '#e04b52' }
];

let serviceIndex = 0;
let characterIndex = 1;
let deleting = false;

if (reduceMotion) {
  typingService.textContent = services[0].name;
  typingService.style.color = services[0].color;
  typingCursor.style.animation = 'none';
} else {
  setTimeout(function typeAddress() {
    const service = services[serviceIndex];
    typingService.style.color = service.color;

    if (deleting) {
      characterIndex -= 1;
      typingService.textContent = service.name.slice(0, characterIndex);

      if (characterIndex === 0) {
        deleting = false;
        serviceIndex = (serviceIndex + 1) % services.length;
        setTimeout(typeAddress, 380);
        return;
      }

      setTimeout(typeAddress, 52 + Math.random() * 38);
      return;
    }

    characterIndex += 1;
    typingService.textContent = services[serviceIndex].name.slice(0, characterIndex);
    typingService.style.color = services[serviceIndex].color;

    if (characterIndex === services[serviceIndex].name.length) {
      deleting = true;
      setTimeout(typeAddress, 1450);
      return;
    }

    setTimeout(typeAddress, 75 + Math.random() * 55);
  }, 1450);
}

const productDesktopImage = document.querySelector('#product-desktop-image');
const productMobileImage = document.querySelector('#product-mobile-image');
const pagerDots = document.querySelectorAll('.pager-dot');
const productSlides = [
  {
    desktop: 'assets/desktop-apps.png',
    mobile: 'assets/mobile-apps.png',
    desktopAlt: 'Containarr desktop control center showing installed apps',
    mobileAlt: 'Containarr iPhone app showing installed apps'
  },
  {
    desktop: 'assets/desktop-containers.png',
    mobile: 'assets/mobile-containers.png',
    desktopAlt: 'Containarr desktop control center showing running containers',
    mobileAlt: 'Containarr iPhone app showing running containers'
  },
  {
    desktop: 'assets/desktop-proxies.png',
    mobile: 'assets/mobile-proxies.png',
    desktopAlt: 'Containarr desktop control center showing configured proxies',
    mobileAlt: 'Containarr iPhone app showing configured proxies'
  },
  {
    desktop: 'assets/desktop-firewall.png',
    mobile: 'assets/mobile-firewall.png',
    desktopAlt: 'Containarr desktop control center showing firewall policies',
    mobileAlt: 'Containarr iPhone app showing firewall policies'
  }
];

let productSlideIndex = 0;
let productSlideTimer;

productSlides.slice(1).forEach((slide) => {
  const desktopImage = new Image();
  const mobileImage = new Image();
  desktopImage.src = slide.desktop;
  mobileImage.src = slide.mobile;
});

function showProductSlide(index) {
  productSlideIndex = index;
  const slide = productSlides[productSlideIndex];

  pagerDots.forEach((dot, dotIndex) => {
    const active = dotIndex === productSlideIndex;
    dot.classList.toggle('active', active);
    dot.setAttribute('aria-pressed', String(active));
  });

  if (reduceMotion) {
    productDesktopImage.src = slide.desktop;
    productMobileImage.src = slide.mobile;
    productDesktopImage.alt = slide.desktopAlt;
    productMobileImage.alt = slide.mobileAlt;
    return;
  }

  productDesktopImage.classList.add('showcase-image-changing');
  productMobileImage.classList.add('showcase-image-changing');

  setTimeout(() => {
    productDesktopImage.src = slide.desktop;
    productMobileImage.src = slide.mobile;
    productDesktopImage.alt = slide.desktopAlt;
    productMobileImage.alt = slide.mobileAlt;
    productDesktopImage.classList.remove('showcase-image-changing');
    productMobileImage.classList.remove('showcase-image-changing');
  }, 180);
}

pagerDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showProductSlide(index);

    if (!reduceMotion) {
      clearInterval(productSlideTimer);
      productSlideTimer = setInterval(() => {
        showProductSlide((productSlideIndex + 1) % productSlides.length);
      }, 6000);
    }
  });
});

if (!reduceMotion) {
  productSlideTimer = setInterval(() => {
    showProductSlide((productSlideIndex + 1) % productSlides.length);
  }, 6000);
}

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.nextElementSibling.textContent;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Select text';
    }

    setTimeout(() => {
      button.textContent = 'Copy';
    }, 1800);
  });
});
