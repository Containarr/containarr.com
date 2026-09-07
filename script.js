const typingService = document.querySelector('#typing-service');
const typingCursor = document.querySelector('.typing-cursor');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const services = [
  { name: 'plex', color: '#e5a00d' },
  { name: 'sonarr', color: '#52a2c9' },
  { name: 'radarr', color: '#f2cf42' },
  { name: 'homey', color: '#c4b5fd' },
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
const pagerDots = document.querySelectorAll('.pager-dot');
const productSlides = [
  {
    desktop: 'assets/desktop-apps.png',
    desktopAlt: 'Containarr desktop control center showing installed apps'
  },
  {
    desktop: 'assets/desktop-containers.png',
    desktopAlt: 'Containarr desktop control center showing running containers'
  },
  {
    desktop: 'assets/desktop-proxies.png',
    desktopAlt: 'Containarr desktop control center showing configured proxies'
  },
  {
    desktop: 'assets/desktop-firewall.png',
    desktopAlt: 'Containarr desktop control center showing firewall policies'
  },
  {
    desktop: 'assets/desktop-domain.png',
    desktopAlt: 'Containarr desktop control center showing domain and certificate settings'
  },
  {
    desktop: 'assets/desktop-backups.png',
    desktopAlt: 'Containarr desktop control center showing Git backup settings'
  },
  {
    desktop: 'assets/desktop-events.png',
    desktopAlt: 'Containarr desktop control center showing events and notification settings'
  },
  {
    desktop: 'assets/desktop-new-app.png',
    desktopAlt: 'Containarr desktop control center showing the new app registry'
  },
  {
    desktop: 'assets/desktop-shell.png',
    desktopAlt: 'Containarr desktop control center showing an interactive container shell'
  }
];

let productSlideIndex = 0;
let productSlideTimer;

productSlides.slice(1).forEach((slide) => {
  const desktopImage = new Image();
  desktopImage.src = slide.desktop;
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
    productDesktopImage.alt = slide.desktopAlt;
    return;
  }

  productDesktopImage.classList.add('showcase-image-changing');

  setTimeout(() => {
    productDesktopImage.src = slide.desktop;
    productDesktopImage.alt = slide.desktopAlt;
    productDesktopImage.classList.remove('showcase-image-changing');
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

document.querySelectorAll('.showcase-nav').forEach((button) => {
  button.addEventListener('click', () => {
    const index = (productSlideIndex + Number(button.dataset.direction) + productSlides.length) % productSlides.length;
    pagerDots[index].click();
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
