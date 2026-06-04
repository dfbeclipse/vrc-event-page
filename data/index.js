/* ===== Stars ===== */
(function () {
	const container = document.getElementById('stars');
	const count = window.innerWidth < 600 ? 60 : 120;

	for (let i = 0; i < count; i++) {
		const star = document.createElement('div');
		star.className = 'star';
		star.style.cssText = `
        left:${ Math.random() * 100 }%;
        top:${ Math.random() * 100 }%;
        --d:${ 2 + Math.random() * 4 }s;
        --delay:-${ Math.random() * 5 }s;
        opacity:${ .2 + Math.random() * .8 };
        width:${ Math.random() < .15 ? 3 : Math.random() < .5 ? 2 : 1 }px;
        height:${ Math.random() < .15 ? 3 : Math.random() < .5 ? 2 : 1 }px;
      `;
		container.appendChild(star);
	}
})();

/* ===== Image fallbacks ===== */
document.querySelectorAll('.js-hide-on-error').forEach(img => {
	img.addEventListener('error', () => {
		img.style.display = 'none';
	});
});

const castHeroImage = document.querySelector('.js-hide-cast-hero-on-error');
if (castHeroImage) {
	castHeroImage.addEventListener('error', () => {
		const castHero = castHeroImage.closest('#cast-hero');
		if (castHero) castHero.style.display = 'none';
	});
}

/* ===== Scroll reveal ===== */
const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			observer.unobserve(entry.target);
		}
	});
}, { threshold: 0.12 });

/* ===== Cast data load & render ===== */
let castData    = [];
let galleryData = [];

// Lightbox shared state
let lbItems        = [];
let currentLbIndex = 0;
let lastFocusedElement = null;

function loadCast() {
	castData = Array.isArray(window.CAST_DATA) ? [...window.CAST_DATA] : [];
	castData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	renderCast();
}

function renderCast() {
	const grid = document.getElementById('cast-grid');
	grid.innerHTML = '';

	castData.forEach((cast, i) => {
		const card = document.createElement('div');
		card.className = 'cast-card reveal visible';

		const imageWrap = document.createElement('div');
		imageWrap.className = 'cast-image';

		const image = document.createElement('img');
		image.src = cast.image;
		image.alt = cast.name;
		image.loading = 'lazy';
		image.decoding = 'async';
		image.addEventListener('error', () => {
			const placeholder = document.createElement('div');
			placeholder.className = 'cast-image-placeholder';
			placeholder.textContent = 'NO IMAGE';
			imageWrap.replaceChildren(placeholder);
		});
		imageWrap.appendChild(image);

		const info = document.createElement('div');
		info.className = 'cast-info';
		const name = document.createElement('div');
		name.className = 'cast-name';
		name.textContent = cast.name;
		info.appendChild(name);

		card.appendChild(imageWrap);
		card.appendChild(info);
		card.addEventListener('click', () => openLightbox(i, castData));
		grid.appendChild(card);
	});
}

loadCast();

/* ===== Gallery data load & render ===== */
function probeImage(url) {
	return new Promise(resolve => {
		const img = new Image();
		img.onload  = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = url;
	});
}

async function loadGallery() {
	const items = [];
	let i = 1;
	while (true) {
		const num    = String(i).padStart(2, '0');
		const urlJpg = `images/gallery/${ num }.jpg`;
		const urlPng = `images/gallery/${ num }.png`;
		if      (await probeImage(urlJpg)) items.push({ image: urlJpg, name: `ギャラリー ${ num }` });
		else if (await probeImage(urlPng)) items.push({ image: urlPng, name: `ギャラリー ${ num }` });
		else break;
		i++;
	}
	galleryData = items;
	renderGallery();
}

function renderGallery() {
	const grid = document.getElementById('gallery-grid');
	if (!grid) return;
	grid.innerHTML = '';

	if (galleryData.length === 0) {
		const empty = document.createElement('p');
		empty.className = 'gallery-empty';
		empty.textContent = '画像を準備中です…';
		grid.appendChild(empty);
		return;
	}

	galleryData.forEach((item, i) => {
		const el = document.createElement('div');
		el.className = 'gallery-item reveal visible';
		el.setAttribute('role', 'button');
		el.setAttribute('tabindex', '0');
		el.setAttribute('aria-label', item.name);

		const img = document.createElement('img');
		img.src = item.image;
		img.alt = item.name;
		img.loading = 'lazy';
		img.decoding = 'async';
		el.appendChild(img);

		el.addEventListener('click', () => openLightbox(i, galleryData));
		el.addEventListener('keydown', e => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openLightbox(i, galleryData);
			}
		});
		grid.appendChild(el);
	});
}

loadGallery();

/* ===== Shooting Stars ===== */
const SHOOTING_STAR_LTR   = Math.random() < 0.5;
const SHOOTING_STAR_ANGLE = SHOOTING_STAR_LTR
	? 33  + (Math.random() * 16 - 8)
	: 147 + (Math.random() * 16 - 8);

let _shootingStarTimer = null;

function _spawnShootingStar() {
	const el = document.createElement('div');
	el.className = 'shooting-star';

	const vw = window.innerWidth;
	const vh = window.innerHeight;

	const startX = SHOOTING_STAR_LTR
		? Math.random() * vw * 0.65
		: vw * 0.35 + Math.random() * vw * 0.65;
	const startY   = Math.random() * vh * 0.55;
	const angle    = SHOOTING_STAR_ANGLE + (Math.random() * 30 - 15);
	const length   = 60  + Math.random() * 200;
	const travel   = 150 + Math.random() * 550;
	const duration = (0.5 + Math.random() * 2.0).toFixed(2);

	el.style.cssText = `
		left:${startX}px;
		top:${startY}px;
		width:${length}px;
		--angle:${angle}deg;
		--travel:${travel}px;
		--duration:${duration}s;
	`;

	document.getElementById('stars').appendChild(el);
	el.addEventListener('animationend', () => el.remove(), { once: true });
}

function _scheduleNextStar() {
	clearTimeout(_shootingStarTimer);
	const delay = 800 + Math.random() * 2200;
	_shootingStarTimer = setTimeout(() => {
		if (!document.hidden) _spawnShootingStar();
		_scheduleNextStar();
	}, delay);
}

document.addEventListener('visibilitychange', () => {
	if (!document.hidden) _scheduleNextStar();
});

_scheduleNextStar();

/* ===== Lightbox ===== */
const lightbox  = document.getElementById('lightbox');
const lbStage   = document.getElementById('lb-stage');
const lbImgCur  = document.getElementById('lb-img-cur');
const lbImgNext = document.getElementById('lb-img-next');
const lbClose   = document.getElementById('lightbox-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

function stageW() {
	return lbStage.offsetWidth || window.innerWidth;
}

function updateLbStageSize(img) {
	if (!img.naturalWidth || !img.naturalHeight) return;
	const maxW = Math.floor(window.innerWidth  * 0.9);
	const maxH = Math.floor(window.innerHeight * 0.92);
	const ar   = img.naturalWidth / img.naturalHeight;
	const w    = ar >= maxW / maxH ? maxW : Math.round(maxH * ar);
	lbStage.style.width = w + 'px';
}

function isGallery() {
	return lbItems === galleryData;
}

function openLightbox(index, items) {
	lbItems        = items;
	currentLbIndex = index;
	lastFocusedElement = document.activeElement;
	const item = lbItems[index];

	lbImgCur.src = item.image;
	lbImgCur.alt = item.name;
	lbImgCur.style.transition = 'none';
	lbImgCur.style.transform  = 'translateX(0)';
	lbImgCur.style.opacity    = '1';

	lbImgNext.src = '';
	lbImgNext.style.transition = 'none';
	lbImgNext.style.transform  = 'translateX(100%)';
	lbImgNext.style.opacity    = '1';

	if (lbImgCur.complete && lbImgCur.naturalWidth) {
		updateLbStageSize(lbImgCur);
	} else {
		lbStage.style.width = '';
		lbImgCur.addEventListener('load', function onLoad() {
			lbImgCur.removeEventListener('load', onLoad);
			updateLbStageSize(lbImgCur);
		});
	}

	lightbox.classList.add('open');
	document.body.style.overflow = 'hidden';
	lbClose.focus();
}

function closeLightbox() {
	lightbox.classList.remove('open');
	document.body.style.overflow = '';
	lbImgCur.src  = '';
	lbImgNext.src = '';
	lbImgCur.style.opacity  = '1';
	lbImgNext.style.opacity = '1';
	lbStage.style.width = '';
	if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

let lbAnimating = false;

/* ---- キャスト用: スライドアニメーション ---- */
function slideAnimate(nextIndex, direction) {
	if (lbAnimating) return;
	lbAnimating = true;

	const sw   = stageW();
	const outX = direction === 'next' ? -sw :  sw;
	const inX  = direction === 'next' ?  sw : -sw;
	const item = lbItems[nextIndex];

	lbImgNext.src = item.image;
	lbImgNext.alt = item.name;
	lbImgNext.style.transition = 'none';
	lbImgNext.style.transform  = `translateX(${ inX }px)`;

	lbImgNext.getBoundingClientRect();

	lbImgCur.style.transition  = 'transform .25s ease';
	lbImgCur.style.transform   = `translateX(${ outX }px)`;
	lbImgNext.style.transition = 'transform .25s ease';
	lbImgNext.style.transform  = 'translateX(0)';

	setTimeout(() => {
		currentLbIndex = nextIndex;
		lbImgCur.style.transition = 'none';
		lbImgCur.style.transform  = 'translateX(0)';

		const revealCur = () => {
			lbImgCur.onload = lbImgCur.onerror = null;
			updateLbStageSize(lbImgCur);
			lbImgNext.style.transition = 'none';
			lbImgNext.style.transform  = `translateX(${ inX }px)`;
			lbImgNext.src = '';
			lbAnimating = false;
		};

		lbImgCur.onload  = revealCur;
		lbImgCur.onerror = revealCur;
		lbImgCur.src = item.image;
		lbImgCur.alt = item.name;
		if (lbImgCur.complete) revealCur();
	}, 260);
}

/* ---- ギャラリー用: フェードアニメーション ---- */
function fadeAnimate(nextIndex) {
	if (lbAnimating) return;
	lbAnimating = true;

	const item = lbItems[nextIndex];

	// フェードアウト
	lbImgCur.style.transition = 'opacity .18s ease';
	lbImgCur.style.opacity    = '0';

	setTimeout(() => {
		currentLbIndex = nextIndex;
		lbImgCur.style.transition = 'none';
		lbImgCur.src = item.image;
		lbImgCur.alt = item.name;

		const fadeIn = () => {
			lbImgCur.onload = lbImgCur.onerror = null;
			updateLbStageSize(lbImgCur);
			// ステージリサイズ後に少し待ってからフェードイン（レイアウト確定を待つ）
			requestAnimationFrame(() => {
				lbImgCur.style.transition = 'opacity .22s ease';
				lbImgCur.style.opacity    = '1';
				lbAnimating = false;
			});
		};

		lbImgCur.onload  = fadeIn;
		lbImgCur.onerror = fadeIn;
		if (lbImgCur.complete) fadeIn();
	}, 180);
}

/* ---- 方向ナビ（キャスト=スライド / ギャラリー=フェード） ---- */
function showPrev() {
	const next = (currentLbIndex - 1 + lbItems.length) % lbItems.length;
	isGallery() ? fadeAnimate(next) : slideAnimate(next, 'prev');
}

function showNext() {
	const next = (currentLbIndex + 1) % lbItems.length;
	isGallery() ? fadeAnimate(next) : slideAnimate(next, 'next');
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', event => { event.stopPropagation(); showPrev(); });
lbNext.addEventListener('click', event => { event.stopPropagation(); showNext(); });
lbImgCur.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
	if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
	if (!lightbox.classList.contains('open')) return;
	if (event.key === 'Escape')     closeLightbox();
	if (event.key === 'ArrowLeft')  showPrev();
	if (event.key === 'ArrowRight') showNext();
	if (event.key === 'Tab')        trapLightboxFocus(event);
});

function trapLightboxFocus(event) {
	const focusable = [lbPrev, lbNext, lbClose]
		.filter(el => el && getComputedStyle(el).display !== 'none');
	if (!focusable.length) return;
	const first = focusable[0];
	const last  = focusable[focusable.length - 1];
	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault(); last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault(); first.focus();
	}
}

/* ===== Touch swipe (lightbox) ===== */
let touchStartX      = 0;
let touchStartY      = 0;
let swipeDir         = null;
let swipePreparedDir = null; // キャストのスライド用
let swipeNextIndex   = -1;

lightbox.addEventListener('touchstart', event => {
	if (lbAnimating) return;
	touchStartX = event.touches[0].clientX;
	touchStartY = event.touches[0].clientY;
	swipeDir         = null;
	swipePreparedDir = null;
	swipeNextIndex   = -1;
	lbImgCur.style.transition  = 'none';
	lbImgNext.style.transition = 'none';
}, { passive: true });

lightbox.addEventListener('touchmove', event => {
	if (!lightbox.classList.contains('open') || lbAnimating) return;

	const dx = event.touches[0].clientX - touchStartX;
	const dy = event.touches[0].clientY - touchStartY;

	if (swipeDir === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
		swipeDir = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
	}
	if (swipeDir !== 'h') return;

	if (isGallery()) {
		// ギャラリー: 軽い追従フィードバックのみ（lb-img-next は使わない）
		lbImgCur.style.transform = `translateX(${ dx * 0.25 }px)`;
		return;
	}

	// キャスト: 既存のスライド追従
	const sw    = stageW();
	const dxDir = dx <= 0 ? 'next' : 'prev';

	if (swipePreparedDir !== dxDir) {
		swipePreparedDir = dxDir;
		if (dxDir === 'next') {
			swipeNextIndex = (currentLbIndex + 1) % lbItems.length;
			lbImgNext.src = lbItems[swipeNextIndex].image;
			lbImgNext.alt = lbItems[swipeNextIndex].name;
			lbImgNext.style.transform = `translateX(${ sw }px)`;
		} else {
			swipeNextIndex = (currentLbIndex - 1 + lbItems.length) % lbItems.length;
			lbImgNext.src = lbItems[swipeNextIndex].image;
			lbImgNext.alt = lbItems[swipeNextIndex].name;
			lbImgNext.style.transform = `translateX(${ -sw }px)`;
		}
	}

	lbImgCur.style.transform  = `translateX(${ dx }px)`;
	lbImgNext.style.transform = dxDir === 'next'
		? `translateX(${ sw + dx }px)`
		: `translateX(${ -sw + dx }px)`;
}, { passive: true });

lightbox.addEventListener('touchend', event => {
	if (!lightbox.classList.contains('open') || lbAnimating) return;

	const dx = event.changedTouches[0].clientX - touchStartX;

	if (isGallery()) {
		// ギャラリー: スナップバックしてからフェード
		lbImgCur.style.transition = 'transform .15s ease';
		lbImgCur.style.transform  = 'translateX(0)';

		if (swipeDir === 'h' && Math.abs(dx) > 50) {
			const nextIdx = dx < 0
				? (currentLbIndex + 1) % lbItems.length
				: (currentLbIndex - 1 + lbItems.length) % lbItems.length;
			setTimeout(() => fadeAnimate(nextIdx), 150);
		}
		return;
	}

	// キャスト: 既存のスライドコミット
	if (swipeDir === 'h' && Math.abs(dx) > 50 && swipePreparedDir !== null) {
		lbAnimating = true;
		const sw         = stageW();
		const outX       = dx < 0 ? -sw :  sw;
		const inX        = dx < 0 ?  sw : -sw;
		const finalIndex = swipeNextIndex;
		const finalItem  = lbItems[finalIndex];

		lbImgCur.style.transition  = 'transform .2s ease';
		lbImgCur.style.transform   = `translateX(${ outX }px)`;
		lbImgNext.style.transition = 'transform .2s ease';
		lbImgNext.style.transform  = 'translateX(0)';

		setTimeout(() => {
			currentLbIndex = finalIndex;
			lbImgCur.style.transition = 'none';
			lbImgCur.style.transform  = 'translateX(0)';

			const revealCur = () => {
				lbImgCur.onload = lbImgCur.onerror = null;
				updateLbStageSize(lbImgCur);
				lbImgNext.style.transition = 'none';
				lbImgNext.style.transform  = `translateX(${ inX }px)`;
				lbImgNext.src    = '';
				swipePreparedDir = null;
				swipeNextIndex   = -1;
				lbAnimating      = false;
			};

			lbImgCur.onload  = revealCur;
			lbImgCur.onerror = revealCur;
			lbImgCur.src = finalItem.image;
			lbImgCur.alt = finalItem.name;
			if (lbImgCur.complete) revealCur();
		}, 220);
	} else {
		lbImgCur.style.transition = 'transform .2s ease';
		lbImgCur.style.transform  = 'translateX(0)';

		if (swipePreparedDir !== null) {
			const sw    = stageW();
			const backX = swipePreparedDir === 'next' ? sw : -sw;
			lbImgNext.style.transition = 'transform .2s ease';
			lbImgNext.style.transform  = `translateX(${ backX }px)`;
			setTimeout(() => {
				lbImgNext.src    = '';
				swipePreparedDir = null;
				swipeNextIndex   = -1;
			}, 220);
		}
	}
}, { passive: true });

/* ===== Video player (クリックまで動画を読み込まない) ===== */
(function () {
	const thumb = document.getElementById('video-thumb');
	const video = document.getElementById('event-video');
	if (!thumb || !video) return;

	thumb.addEventListener('click', () => {
		thumb.style.display = 'none';
		video.src = 'video/Eclipse_01.mp4';
		video.style.display = 'block';

		// ローカル動画が読み込めない場合は YouTube にフォールバック
		video.addEventListener('error', () => {
			video.style.display = 'none';
			const iframe = document.createElement('iframe');
			iframe.src = 'https://www.youtube.com/embed/EqE0eIhrWfw?autoplay=1';
			iframe.title = '闇堕ち少女酒場いくりぷ イベント紹介';
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
			iframe.allowFullscreen = true;
			iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
			video.parentElement.appendChild(iframe);
		}, { once: true });

		video.play().catch(() => {}); // autoplay ポリシーでブロックされても無視
	}, { once: true });
})();

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
