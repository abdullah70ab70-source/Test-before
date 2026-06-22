// دوال التوست والتنبيهات
let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// التعامل مع تنبيه الاستئناف
function closeResumeBanner() {
    const banner = document.getElementById('resume-banner');
    if(banner) banner.classList.remove('show');
}
function resumePlayback() {
    closeResumeBanner();
    if(window.resumeData) {
        if (window.resumeData.id === 'radio') {
            playRadio();
        } else {
            playSurah(window.resumeData.id, window.resumeData.url);
        }
    }
}

// التعامل مع شريط تثبيت التطبيق الانزلاقي
function closeInstallBanner() {
    const banner = document.getElementById('install-banner');
    if(banner) banner.classList.remove('show');
}

const surahNamesEn = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const translations = {
    ar: { langLabel: "EN", sheikhPrefix: "الشيخ", surahPrefix: "سورة", downloading: "جاري تحميل", downloadComplete: "تمت العملية بنجاح!", resumeBtn: "متابعة الاستماع", cancelBtn: "إلغاء", radioTitle: "إذاعة القرآن الكريم من القاهرة", live: "مباشر", installTitle: "تثبيت تطبيق Egy Quran", installDesc: "تجربة استماع أسرع وتعمل بدون إنترنت", installBtn: "تثبيت", radioTooltip: "إذاعة القرآن الكريم" },
    en: { langLabel: "AR", sheikhPrefix: "Sheikh", surahPrefix: "Surah", downloading: "Downloading", downloadComplete: "Success!", resumeBtn: "Resume Listening", cancelBtn: "Cancel", radioTitle: "Holy Quran Radio Cairo", live: "LIVE", installTitle: "Install Egy Quran App", installDesc: "Faster experience with offline support", installBtn: "Install", radioTooltip: "Holy Quran Radio" }
};
let currentLang = 'ar';
const radioUrl = "https://stream.radiojar.com/8s5u5tpdtwzuv";

const recitersList = [
    { id: "husary", nameAr: "محمود خليل الحصري", nameEn: "Mahmoud Khalil Al-Husary", image: "hosary.jpg" },
    { id: "minshawi", nameAr: "محمد صديق المنشاوي", nameEn: "Muhammad Siddiq Minshawi", image: "minshawy.jpg" },
    { id: "mustafa", nameAr: "مصطفى إسماعيل", nameEn: "Mustafa Ismail", image: "mustafa.jpg" },
    { id: "banna", nameAr: "محمود علي البنا", nameEn: "Mahmoud Ali Al-Banna", image: "banna.jpg" },
    { id: "basit", nameAr: "عبد الباسط عبد الصمد", nameEn: "Abdul Basit Abdul Samad", image: "basit.jpg" }
];

const editionsConfig = {
    "husary": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "husary_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" }, 
        2: { pillAr: "ورش", pillEn: "Warsh", file: "husary_2.json", descAr: "رواية ورش عن نافع", descEn: "Warsh A'n Nafi'" }, 
        3: { pillAr: "قالون", pillEn: "Qalun", file: "husary_3.json", descAr: "رواية قالون عن نافع", descEn: "Qalun A'n Nafi'" }, 
        4: { pillAr: "الدوري", pillEn: "Al-Duri", file: "husary_4.json", descAr: "رواية الدوري عن أبي عمرو", descEn: "Al-Duri A'n Abi Amr" },
        5: { pillAr: "المجود", pillEn: "Mujawwad", file: "husary_5.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" } 
    },
    "minshawi": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "minshawi_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" }, 
        2: { pillAr: "الختمة الثانية", pillEn: "2nd Khatma", file: "minshawi_2.json", descAr: "الختمة الثانية (المفقودة)", descEn: "The Second Khatma (Lost)" },
        3: { pillAr: "المعلم", pillEn: "Mu'allim", file: "minshawi_3.json", descAr: "المصحف المعلم", descEn: "Al-Mushaf Al-Mu'allim" },
        4: { pillAr: "المجود", pillEn: "Mujawwad", file: "minshawi_4.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    },
    "mustafa": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "mustafa_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" },
        2: { pillAr: "المجود", pillEn: "Mujawwad", file: "mustafa_2.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    },
    "banna": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "banna_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" },
        2: { pillAr: "المجود", pillEn: "Mujawwad", file: "banna_2.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    },
    "basit": { 
        1: { pillAr: "حفص (الإذاعة)", pillEn: "Hafs (Radio)", file: "basit_1.json", descAr: "الإذاعة المصرية", descEn: "Egyptian Radio" },
        2: { pillAr: "ورش", pillEn: "Warsh", file: "basit_2.json", descAr: "رواية ورش عن نافع", descEn: "Warsh A'n Nafi'" },
        3: { pillAr: "المجود", pillEn: "Mujawwad", file: "basit_3.json", descAr: "التلاوة المجودة", descEn: "Mujawwad Recitation" }
    }
};

const icons = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    loading: '<svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    saved: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>'
};

// تهيئة قاعدة بيانات IndexedDB
const dbName = "EgyQuranDB";
const storeName = "editionsCache";

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function getCache(key) {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        return null;
    }
}

async function setCache(key, val) {
    try {
        const db = await openDB();
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        store.put(val, key);
    } catch (e) { }
}

// تهيئة المشغل
let audioInstance = new Audio();
audioInstance.crossOrigin = "anonymous"; 

let audioCtx, gainNode, audioSource;

function initAudioBoost() {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
                audioSource = audioCtx.createMediaElementSource(audioInstance);
                
                gainNode = audioCtx.createGain();
                gainNode.gain.value = 3.5; 
                
                const compressor = audioCtx.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
                compressor.knee.setValueAtTime(30, audioCtx.currentTime);
                compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
                compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
                compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
                
                audioSource.connect(gainNode);
                gainNode.connect(compressor);
                compressor.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(e => console.log("Context Resume Error:", e));
        }
    } catch (e) {}
}

let currentTheme = 'light', currentSheikhId = "husary", currentEdition = 1;
let activeSurahsData = [], playingSurahId = null, playingSheikhId = null, playingEditionId = null, isBuffering = false;
let isRadioHeaderActive = false;
let isFocusMode = false;

let preloadAudioObj = new Audio(); 
let preloadedSurahId = null;

let activeDownloads = {};
let savedReciterEditions = {}; 

let playbackMode = 'autonext'; 
let playbackMenuOpen = false;

// متغيرات مؤقت النوم
let sleepTimerTimeout = null;
let sleepTimerSurahEnd = false;
let timerMenuOpen = false;

function applyTransition(elementId) {
    const el = document.getElementById(elementId);
    if(el) {
        el.classList.remove('fade-slide-up');
        void el.offsetWidth;
        el.classList.add('fade-slide-up');
    }
}

function getSurahName(id, nameAr) { return currentLang === 'ar' ? nameAr : surahNamesEn[id]; }

function updateHeaderUI() {
    if (isFocusMode && (playingSheikhId || playingSurahId === 'radio')) {
        if (playingSurahId === 'radio') {
            document.getElementById('header-avatar-img').src = 'radio.png';
            document.getElementById('main-title').innerHTML = `<strong>${translations[currentLang].radioTitle}</strong>`;
            document.getElementById('header-subtitle').innerText = translations[currentLang].live;
        } else {
            const s = recitersList.find(r => r.id === playingSheikhId);
            document.getElementById('header-avatar-img').src = s.image;
            document.getElementById('main-title').innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
            document.getElementById('header-subtitle').innerText = currentLang === 'ar' ? editionsConfig[playingSheikhId][playingEditionId].descAr : editionsConfig[playingSheikhId][playingEditionId].descEn;
        }
    } else {
        if (isRadioHeaderActive) {
            document.getElementById('header-avatar-img').src = 'radio.png';
            document.getElementById('main-title').innerHTML = `<strong>${translations[currentLang].radioTitle}</strong>`;
            document.getElementById('header-subtitle').innerText = translations[currentLang].live;
        } else {
            const s = recitersList.find(r => r.id === currentSheikhId);
            if (s) {
                document.getElementById('header-avatar-img').src = s.image;
                document.getElementById('main-title').innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
                document.getElementById('header-subtitle').innerText = currentLang === 'ar' ? editionsConfig[currentSheikhId][currentEdition].descAr : editionsConfig[currentSheikhId][currentEdition].descEn;
            }
        }
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    document.documentElement.style.setProperty('--dir', document.documentElement.dir);
    
    document.getElementById('lang-label').innerText = translations[currentLang].langLabel;
    
    const resumeBtn = document.getElementById('resume-btn-yes');
    const cancelBtn = document.getElementById('resume-btn-no');
    if(resumeBtn) resumeBtn.innerText = translations[currentLang].resumeBtn;
    if(cancelBtn) cancelBtn.innerText = translations[currentLang].cancelBtn;
    
    const installTitle = document.getElementById('install-title');
    if(installTitle) {
        installTitle.innerText = translations[currentLang].installTitle;
        document.getElementById('install-desc').innerText = translations[currentLang].installDesc;
        document.getElementById('install-action-btn').innerText = translations[currentLang].installBtn;
    }
    
    const radioTooltip = document.getElementById('radio-tooltip');
    if(radioTooltip) radioTooltip.innerText = translations[currentLang].radioTooltip;

    updateHeaderUI();
    setPlaybackMode(playbackMode);
    
    if (playingSurahId === 'radio') {
        document.getElementById('player-track-title').innerText = translations[currentLang].radioTitle;
        document.getElementById('total-time').innerText = translations[currentLang].live;
    } else if (playingSurahId) {
        const sData = activeSurahsData.find(s => s.id === playingSurahId);
        if(sData) document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
    }

    renderSheikhCarousel();
    renderEditionDropdown();
    if (activeSurahsData && activeSurahsData.length > 0) {
        renderSurahsList();
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (isRadioHeaderActive || playingSurahId === 'radio') {
        document.title = `Egy Quran - ${translations[currentLang].radioTitle}`;
        if (metaDesc) metaDesc.setAttribute("content", currentLang === 'ar' ? "استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة على منصة Egy Quran." : "Listen to the live broadcast of Holy Quran Radio Cairo on Egy Quran.");
    } else {
        const s = recitersList.find(r => r.id === currentSheikhId);
        if (s) {
            const sheikhName = currentLang === 'ar' ? s.nameAr : s.nameEn;
            document.title = `Egy Quran - ${currentLang === 'ar' ? 'الشيخ' : 'Sheikh'} ${sheikhName}`;
            if (metaDesc) metaDesc.setAttribute("content", currentLang === 'ar' ? `استمع وحمل القرآن الكريم كاملاً بصوت الشيخ ${sheikhName} بجودة عالية وبدون إعلانات مزعجة على Egy Quran.` : `Listen and download the complete Holy Quran by Sheikh ${sheikhName} in high quality on Egy Quran.`);
        }
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    document.getElementById('theme-toggle-btn').innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun;
}

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    const focusBtn = document.getElementById('focus-toggle-btn');
    
    if (isFocusMode) {
        document.body.classList.add('focus-mode-active');
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        if (focusBtn) focusBtn.classList.add('active-feature');
        showToast(currentLang === 'ar' ? 'تم تفعيل وضع الاستماع الهادئ' : 'Focus Mode Enabled');
    } else {
        document.body.classList.remove('focus-mode-active');
        if (focusBtn) focusBtn.classList.remove('active-feature');
        showToast(currentLang === 'ar' ? 'تم إيقاف وضع الاستماع الهادئ' : 'Focus Mode Disabled');
    }
    updateHeaderUI();
    syncUIWithAudioState(); 
}

// --- قوائم التشغيل والمؤقت ---
function togglePlaybackMenu(event) {
    if(event) event.stopPropagation();
    playbackMenuOpen = !playbackMenuOpen;
    const menu = document.getElementById('playback-menu');
    if(menu) {
        if (playbackMenuOpen) { 
            menu.classList.add('show'); 
            const timerMenu = document.getElementById('timer-menu');
            if(timerMenu) timerMenu.classList.remove('show');
            timerMenuOpen = false;
        } else { 
            menu.classList.remove('show'); 
        }
    }
}

function toggleTimerMenu(event) {
    if(event) event.stopPropagation();
    timerMenuOpen = !timerMenuOpen;
    const menu = document.getElementById('timer-menu');
    if(menu) {
        if (timerMenuOpen) { 
            menu.classList.add('show'); 
            const pbMenu = document.getElementById('playback-menu');
            if(pbMenu) pbMenu.classList.remove('show'); 
            playbackMenuOpen = false; 
        } else { 
            menu.classList.remove('show'); 
        }
    }
}

document.addEventListener('click', (e) => {
    if (playbackMenuOpen && !e.target.closest('#playback-wrapper')) togglePlaybackMenu();
    if (timerMenuOpen && !e.target.closest('#timer-wrapper')) toggleTimerMenu();
});

function setPlaybackMode(mode, event) {
    if(event) event.stopPropagation();
    playbackMode = mode;
    audioInstance.loop = (mode === 'loop');

    const btn = document.getElementById('btn-playback-mode');
    const textSpan = document.getElementById('playback-text');
    const iconSvg = document.getElementById('playback-icon');

    if (mode === 'autonext') {
        btn.classList.add('active-feature');
        textSpan.innerText = currentLang === 'ar' ? 'تلقائي' : 'Auto';
        iconSvg.innerHTML = '<path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path>';
    } else if (mode === 'loop') {
        btn.classList.add('active-feature');
        textSpan.innerText = currentLang === 'ar' ? 'تكرار' : 'Loop';
        iconSvg.innerHTML = '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>';
    } else {
        btn.classList.remove('active-feature');
        textSpan.innerText = currentLang === 'ar' ? 'إيقاف' : 'Off';
        iconSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>';
    }

    renderPlaybackMenu();
    if (playbackMenuOpen) togglePlaybackMenu();
}

function setSleepTimer(val, event) {
    if(event) event.stopPropagation();
    clearTimeout(sleepTimerTimeout);
    sleepTimerSurahEnd = false;
    const btn = document.getElementById('btn-sleep-timer');
    if(!btn) return;

    if (val === 'off') {
        btn.classList.remove('active-feature');
        showToast(currentLang === 'ar' ? 'تم إيقاف مؤقت النوم' : 'Sleep timer disabled');
    } else if (val === 'end') {
        sleepTimerSurahEnd = true;
        btn.classList.add('active-feature');
        showToast(currentLang === 'ar' ? 'سيتوقف التشغيل بعد انتهاء السورة' : 'Will stop after Surah ends');
    } else {
        btn.classList.add('active-feature');
        showToast(currentLang === 'ar' ? `سيتوقف التشغيل بعد ${val} دقيقة` : `Will stop after ${val} mins`);
        sleepTimerTimeout = setTimeout(() => {
            audioInstance.pause();
            btn.classList.remove('active-feature');
            showToast(currentLang === 'ar' ? 'تم إيقاف التشغيل التلقائي (مؤقت النوم)' : 'Playback stopped by timer');
        }, val * 60 * 1000);
    }
    toggleTimerMenu();
}

function renderPlaybackMenu() {
    const menu = document.getElementById('playback-menu');
    if(!menu) return;
    const items = [
        { id: 'autonext', textAr: 'تشغيل تلقائي', textEn: 'Auto-Next' },
        { id: 'loop', textAr: 'تكرار السورة', textEn: 'Loop Surah' },
        { id: 'off', textAr: 'إيقاف', textEn: 'Off' }
    ];
    menu.innerHTML = items.map(item =>
        `<div class="playback-menu-item ${playbackMode === item.id ? 'active' : ''}" onclick="setPlaybackMode('${item.id}', event)">
            ${currentLang === 'ar' ? item.textAr : item.textEn}
        </div>`
    ).join('');
}

function syncUIWithAudioState() {
    const isPlaying = !audioInstance.paused;
    const statusIcon = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play);
    const playBtn = document.getElementById('player-play-btn');
    if(playBtn) playBtn.innerHTML = statusIcon;

    const radioBtn = document.getElementById('radio-btn');
    if (radioBtn) {
        if (playingSurahId === 'radio' && isPlaying && !isBuffering) {
            radioBtn.classList.add('radio-active');
        } else {
            radioBtn.classList.remove('radio-active');
        }
    }

    const isHeaderMatchingPlaying = isFocusMode || 
        (playingSurahId === 'radio' && isRadioHeaderActive) || 
        (playingSurahId !== 'radio' && currentSheikhId === playingSheikhId && currentEdition == playingEditionId);

    const headerEq = document.getElementById('header-equalizer');
    if (headerEq) {
        if (isPlaying && !isBuffering && isHeaderMatchingPlaying) {
            headerEq.classList.add('playing');
        } else {
            headerEq.classList.remove('playing');
        }
    }

    document.querySelectorAll('.surah-row').forEach(row => {
        const sId = parseInt(row.getAttribute('data-id'));
        const pBtn = row.querySelector('.play-cell');
        const isCurrentActive = (sId === playingSurahId && playingSurahId !== 'radio' && currentSheikhId === playingSheikhId && currentEdition === playingEditionId);
        if (isCurrentActive) { row.classList.add('active-row'); if(pBtn) pBtn.innerHTML = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play); } 
        else { row.classList.remove('active-row'); if(pBtn) pBtn.innerHTML = icons.play; }
    });

    document.querySelectorAll('.sheikh-item').forEach(item => {
        const sId = item.getAttribute('data-id');
        let badge = item.querySelector('.playing-badge');
        if (sId === playingSheikhId && isPlaying && !isBuffering && playingSurahId !== 'radio') {
            if (!badge) item.querySelector('.sheikh-avatar-container').insertAdjacentHTML('beforeend', `<div class="playing-badge"><div class="equalizer-bar" style="animation: equalize 0.8s infinite alternate"></div><div class="equalizer-bar" style="animation: equalize 0.5s infinite alternate; animation-delay:0.1s"></div><div class="equalizer-bar" style="animation: equalize 0.7s infinite alternate; animation-delay:0.2s"></div></div>`);
        } else if (badge) badge.remove();
    });

    document.querySelectorAll('.edition-pill').forEach(pill => {
        const pillKey = pill.getAttribute('data-key');
        const isPlayingThisEdition = (currentSheikhId === playingSheikhId && pillKey == playingEditionId && isPlaying && !isBuffering && playingSurahId !== 'radio');
        let dot = pill.querySelector('.active-dot');
        if (isPlayingThisEdition) {
            if (!dot) pill.insertAdjacentHTML('beforeend', `<span class="active-dot"></span>`);
        } else {
            if (dot) dot.remove();
        }
    });
}

async function loadEditionData(sheikhId, editionNum) {
    const config = editionsConfig[sheikhId][editionNum];
    if (!config) return; 
    const cacheKey = `cache_${config.file}`;
    
    const cached = await getCache(cacheKey);
    if (cached) { 
        activeSurahsData = cached; 
        renderSurahsList(); 
    }
    
    try {
        const res = await fetch(config.file);
        const data = await res.json();
        activeSurahsData = data;
        await setCache(cacheKey, data); 
        renderSurahsList();
    } catch (e) { 
        if (!cached) {
            showToast(currentLang === 'ar' ? "فشل جلب قائمة السور، تحقق من اتصالك" : "Failed to load Surahs, check connection");
        }
    }
}

function renderSheikhCarousel() {
    const container = document.getElementById('sheikh-carousel');
    if(!container) return;
    container.innerHTML = recitersList.map(s => {
        const nameToShow = currentLang === 'ar' ? s.nameAr : s.nameEn;
        return `<div class="sheikh-item ${s.id === currentSheikhId ? 'active' : ''}" data-id="${s.id}" onclick="selectSheikh('${s.id}')">
                    <div class="sheikh-avatar-container"><img src="${s.image}" class="sheikh-avatar-img"></div>
                    <div style="font-size:0.65rem; font-weight:700; margin-top:6px;">${nameToShow}</div>
                </div>`;
    }).join('');
    
    applyTransition('sheikh-carousel');
    syncUIWithAudioState();
}

async function renderSurahsList() {
    const container = document.getElementById('main-surah-list');
    if(!container) return;
    container.innerHTML = activeSurahsData.map(s => {
        return `<div class="surah-row" data-id="${s.id}">
                    <div class="surah-info"><span class="surah-number">${String(s.id).padStart(3, '0')}</span><span class="surah-name">${translations[currentLang].surahPrefix} ${getSurahName(s.id, s.name)}</span></div>
                    <div class="surah-actions" style="flex-direction: ${currentLang === 'ar' ? 'row' : 'row-reverse'};">
                        <button class="surah-action-btn play-cell" onclick="playSurah(${s.id}, '${s.url}')">${icons.play}</button>
                        <button class="surah-action-btn download-btn" id="dl-btn-${s.id}" onclick="startDownload(${s.id}, '${s.url}')" title="تحميل / حفظ">${icons.download}</button>
                    </div>
                </div>`;
    }).join('');
    
    applyTransition('main-surah-list');
    syncUIWithAudioState();

    // فحص الكاش الخاص بالصوتيات المحفوظة وإضافة علامة صح صغيرة جداً
    if ('caches' in window) {
        try {
            const cache = await caches.open('egy-quran-audio');
            for (let s of activeSurahsData) {
                const match = await cache.match(s.url);
                if (match) {
                    const row = container.querySelector(`.surah-row[data-id="${s.id}"]`);
                    if (row) {
                        const playBtn = row.querySelector('.play-cell');
                        if (playBtn && !row.querySelector('.tiny-saved-check')) {
                            playBtn.insertAdjacentHTML('afterend', `<svg class="tiny-saved-check" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; margin: 0 4px;"><path d="M20 6L9 17l-5-5"></path></svg>`);
                        }
                    }
                }
            }
        } catch(e) {}
    }
}

const dlModal = document.getElementById('download-modal'), dlFill = document.getElementById('dl-progress-fill'), dlPct = document.getElementById('dl-modal-pct'), dlTitle = document.getElementById('dl-modal-title');
async function startDownload(id, url) {
    // فحص وجود إنترنت أولاً
    if (!navigator.onLine) {
        showToast(currentLang === 'ar' ? "عذراً، لا يوجد اتصال بالإنترنت للتحميل." : "No internet connection to download.");
        return;
    }

    if (activeDownloads[id]) return; 

    // فحص ما إذا كانت السورة محملة مسبقاً لإعطاء رسالة تأكيد
    if ('caches' in window) {
        try {
            const cache = await caches.open('egy-quran-audio');
            const isCached = await cache.match(url);
            if (isCached) {
                const confirmMsg = currentLang === 'ar' ? "هذه السورة محملة مسبقاً، هل توافق على الاستمرار في تحميلها مرة أخرى؟" : "Surah is already downloaded. Download again?";
                if (!window.confirm(confirmMsg)) {
                    return; // إلغاء التحميل إذا لم يوافق المستخدم
                }
            }
        } catch(e) {}
    }

    activeDownloads[id] = true;
    const sData = activeSurahsData.find(s => s.id === id); 
    const sName = getSurahName(id, sData.name);
    if(dlModal) {
        dlModal.style.display = 'flex'; dlFill.style.width = '0%'; dlPct.innerText = '0%'; dlTitle.innerText = `${translations[currentLang].downloading} ${sName}...`;
    }
    
    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error("Network Error");
        
        let cacheResponse = null;
        if ('caches' in window) {
            cacheResponse = response.clone();
        }

        const total = parseInt(response.headers.get('content-length'), 10);
        const reader = response.body.getReader();
        let received = 0; let chunks = [];
        
        while(true) {
            const {done, value} = await reader.read();
            if (done) break; chunks.push(value); received += value.length;
            if (total && dlFill) { const pct = Math.round((received / total) * 100); dlFill.style.width = pct + '%'; dlPct.innerText = pct + '%'; } 
        }
        
        // حفظ في الكاش
        if (cacheResponse) {
            const cache = await caches.open('egy-quran-audio');
            await cache.put(url, cacheResponse);
        }
        
        // التحميل الفعلي للملف
        const blob = new Blob(chunks, { type: 'audio/mpeg' }); const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = objectUrl; a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(objectUrl);
        
        finishDownloadUI(id, true);
    } catch (err) {
        // Fallback
        const a = document.createElement('a'); a.href = url; a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`; a.target = '_blank';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        finishDownloadUI(id, false);
    }
}

function finishDownloadUI(id, success) { 
    if(dlTitle) {
        dlTitle.innerText = translations[currentLang].downloadComplete; dlFill.style.width = '100%'; dlPct.innerText = '100%'; 
        setTimeout(() => { 
            dlModal.style.display = 'none'; 
            delete activeDownloads[id]; 
            if(success) renderSurahsList(); 
        }, 1500);
    }
}

async function selectSheikh(id) {
    currentSheikhId = id;
    isRadioHeaderActive = false;
    
    if (id === playingSheikhId && playingEditionId && editionsConfig[id][playingEditionId]) currentEdition = playingEditionId; else currentEdition = savedReciterEditions[id] || 1;
    const s = recitersList.find(r => r.id === id);

    const sheikhName = currentLang === 'ar' ? s.nameAr : s.nameEn;
    document.title = `Egy Quran - ${currentLang === 'ar' ? 'الشيخ' : 'Sheikh'} ${sheikhName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute("content", currentLang === 'ar' ? 
            `استمع وحمل القرآن الكريم كاملاً بصوت الشيخ ${sheikhName} بجودة عالية وبدون إعلانات مزعجة على Egy Quran.` : 
            `Listen and download the complete Holy Quran by Sheikh ${sheikhName} in high quality on Egy Quran.`);
    }
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?sheikh=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    updateHeaderUI();

    renderSheikhCarousel(); renderEditionDropdown(); await loadEditionData(id, currentEdition);
    
    if (playingSurahId && playingSurahId !== 'radio' && playingSheikhId === id && playingEditionId === currentEdition) {
        const sData = activeSurahsData.find(sur => sur.id === playingSurahId);
        if(sData && audioInstance.src === "") {
            audioInstance.src = sData.url;
            document.getElementById('global-player').style.display = 'block';
            document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
            syncUIWithAudioState();
        }
    }
}

function renderEditionDropdown() {
    const wrapper = document.getElementById('edition-dropdown-wrapper');
    if(!wrapper) return;
    const configs = editionsConfig[currentSheikhId]; const keys = Object.keys(configs);
    const pills = keys.map(key => `<div class="edition-pill ${currentEdition == key ? 'active' : ''}" data-key="${key}" onclick="selectEditionDropdown(${key}, event)">${currentLang === 'ar' ? configs[key].pillAr : configs[key].pillEn}</div>`).join('');
    wrapper.innerHTML = `<div class="edition-list-wrapper"><div class="edition-list">${pills}</div></div>`;
    
    applyTransition('edition-dropdown-wrapper');
    syncUIWithAudioState(); 
}

async function selectEditionDropdown(num, event) {
    if(event) event.stopPropagation(); if(currentEdition == num) return; 
    currentEdition = num; savedReciterEditions[currentSheikhId] = num; 
    isRadioHeaderActive = false;
    
    updateHeaderUI();
    renderEditionDropdown(); await loadEditionData(currentSheikhId, num);
}

function hideRadioDiscovery() {
    const tooltip = document.getElementById('radio-tooltip');
    const badge = document.getElementById('radio-badge');
    if(tooltip) tooltip.classList.remove('show');
    if(badge) badge.classList.remove('show');
    localStorage.setItem('radioDiscovered', 'true');
}

function playRadio() {
    hideRadioDiscovery();
    initAudioBoost(); 

    if (playingSurahId === 'radio') { togglePlayPause(); return; }
    
    playingSurahId = 'radio'; 
    playingSheikhId = null; 
    playingEditionId = null;
    
    isBuffering = true; 
    
    audioInstance.pause();
    audioInstance.src = radioUrl; 
    audioInstance.loop = false;
    audioInstance.load(); 
    
    audioInstance.play().catch(e => {
        if (!navigator.onLine) {
            isBuffering = true;
        } else {
            isBuffering = false;
        }
        syncUIWithAudioState();
    });
    
    localStorage.setItem('lastPlayedQuran', JSON.stringify({ sheikh: null, edition: null, surah: 'radio' }));
    
    document.getElementById('global-player').style.display = 'block'; 
    document.getElementById('player-track-title').innerText = translations[currentLang].radioTitle;
    
    isRadioHeaderActive = true;
    updateHeaderUI();
    
    document.title = `Egy Quran - ${translations[currentLang].radioTitle}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", currentLang === 'ar' ? "استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة على منصة Egy Quran." : "Listen to the live broadcast of Holy Quran Radio Cairo on Egy Quran.");
    
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?listen=radio`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    document.getElementById('progress-bar-fill').style.width = '100%';
    document.getElementById('progress-thumb').style.display = 'none';
    document.getElementById('time-separator').style.display = 'none';
    document.getElementById('curr-time').innerText = "";
    document.getElementById('total-time').innerText = translations[currentLang].live;
    
    syncUIWithAudioState();
    
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ 
            title: translations[currentLang].radioTitle, 
            artist: translations[currentLang].live, 
            album: 'Egy Quran', 
            artwork: [ { src: 'radio.png', sizes: '512x512', type: 'image/png' } ] 
        });
        navigator.mediaSession.setActionHandler('play', () => togglePlayPause()); 
        navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', null); 
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null); 
    }
}

async function playSurah(id, url) {
    initAudioBoost(); 
    if (playingSurahId === id && playingSheikhId === currentSheikhId && playingEditionId === currentEdition) { togglePlayPause(); return; }
    
    isRadioHeaderActive = false;
    playingSurahId = id; playingSheikhId = currentSheikhId; playingEditionId = currentEdition;
    
    isBuffering = true; 
    audioInstance.pause();
    
    // دعم الاستماع الفعلي بدون إنترنت
    try {
        if ('caches' in window) {
            const cache = await caches.open('egy-quran-audio');
            const cachedRes = await cache.match(url);
            if (cachedRes) {
                const blob = await cachedRes.blob();
                audioInstance.src = URL.createObjectURL(blob);
            } else {
                audioInstance.src = url; 
            }
        } else {
            audioInstance.src = url;
        }
    } catch(e) {
        audioInstance.src = url;
    }

    audioInstance.loop = (playbackMode === 'loop');
    audioInstance.load();
    
    audioInstance.play().catch(e => {
        if (!navigator.onLine) {
            isBuffering = true;
        } else {
            isBuffering = false;
        }
        syncUIWithAudioState();
    });
    
    localStorage.setItem('lastPlayedQuran', JSON.stringify({ sheikh: playingSheikhId, edition: playingEditionId, surah: playingSurahId }));
    const sData = activeSurahsData.find(s => s.id === id); const sName = getSurahName(id, sData.name);
    const sheikhObj = recitersList.find(r => r.id === currentSheikhId);
    
    document.getElementById('global-player').style.display = 'block'; 
    document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${sName}`;
    
    document.getElementById('progress-thumb').style.display = 'block';
    document.getElementById('time-separator').style.display = 'inline';

    updateHeaderUI();
    syncUIWithAudioState();
    
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: `${translations[currentLang].surahPrefix} ${sName}`, artist: currentLang === 'ar' ? sheikhObj.nameAr : sheikhObj.nameEn, album: 'مصحف كبار القراء', artwork: [ { src: sheikhObj.image, sizes: '512x512', type: 'image/jpeg' } ] });
        navigator.mediaSession.setActionHandler('play', () => togglePlayPause()); navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious()); navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
        navigator.mediaSession.setActionHandler('seekto', (details) => { audioInstance.currentTime = details.seekTime; });
    }
}

function togglePlayPause() { 
    initAudioBoost(); 
    if (audioInstance.paused && audioInstance.src) {
        isBuffering = true;
        syncUIWithAudioState();
        
        if (playingSurahId === 'radio' && !audioInstance.src.includes('blob')) {
            audioInstance.pause();
            audioInstance.src = radioUrl;
            audioInstance.load();
        }
        
        audioInstance.play().catch(e => {
            if (!navigator.onLine) {
                isBuffering = true;
            } else {
                isBuffering = false;
            }
            syncUIWithAudioState();
        });
    } else {
        audioInstance.pause(); 
    }
}

function playNext() { 
    if(playingSurahId === 'radio') return;
    const idx = activeSurahsData.findIndex(s => s.id === playingSurahId); if (idx < activeSurahsData.length - 1) { const next = activeSurahsData[idx + 1]; playSurah(next.id, next.url); } 
}
function playPrevious() { 
    if(playingSurahId === 'radio') return;
    const idx = activeSurahsData.findIndex(s => s.id === playingSurahId); if (idx > 0) { const prev = activeSurahsData[idx - 1]; playSurah(prev.id, prev.url); } 
}

audioInstance.addEventListener('waiting', () => { isBuffering = true; syncUIWithAudioState(); });
audioInstance.addEventListener('playing', () => { isBuffering = false; syncUIWithAudioState(); });
audioInstance.addEventListener('play', () => { isBuffering = true; syncUIWithAudioState(); });
audioInstance.addEventListener('pause', () => { isBuffering = false; syncUIWithAudioState(); });

audioInstance.addEventListener('error', () => {
    if (!navigator.onLine) {
        isBuffering = true; 
    } else {
        isBuffering = false;
    }
    syncUIWithAudioState();
    showToast(currentLang === 'ar' ? "خطأ في الاتصال، يرجى التحقق من الإنترنت" : "Network error, please check connection");
});

window.addEventListener('online', () => {
    if (isBuffering && playingSurahId && !audioInstance.paused) {
        audioInstance.load();
        audioInstance.play().catch(e => console.log(e));
        showToast(currentLang === 'ar' ? "تمت استعادة الاتصال، جاري التشغيل..." : "Connection restored, playing...");
    }
});

window.addEventListener('offline', () => {
    if (!audioInstance.paused || isBuffering) {
        isBuffering = true;
        syncUIWithAudioState();
        showToast(currentLang === 'ar' ? "انقطع الاتصال بالإنترنت" : "Internet connection lost");
    }
});

audioInstance.onended = () => {
    if (sleepTimerSurahEnd) {
        sleepTimerSurahEnd = false;
        const btn = document.getElementById('btn-sleep-timer');
        if(btn) btn.classList.remove('active-feature');
        return; 
    }
    if (playbackMode === 'autonext' && playingSurahId !== 'radio') {
        playNext();
    }
};

let lastPositionUpdateTime = 0;
audioInstance.ontimeupdate = () => {
    if (playingSurahId === 'radio') {
        document.getElementById('progress-bar-fill').style.width = '100%';
        document.getElementById('curr-time').innerText = "";
        document.getElementById('total-time').innerText = translations[currentLang].live;
    } else if (audioInstance.duration && !isDragging) {
        document.getElementById('progress-bar-fill').style.width = ((audioInstance.currentTime / audioInstance.duration) * 100) + '%';
        document.getElementById('curr-time').innerText = formatTime(audioInstance.currentTime);
        document.getElementById('total-time').innerText = formatTime(audioInstance.duration);

        if (playbackMode === 'autonext' && (audioInstance.duration - audioInstance.currentTime) < 15) {
            const idx = activeSurahsData.findIndex(s => s.id === playingSurahId);
            if (idx !== -1 && idx < activeSurahsData.length - 1) {
                const nextSurah = activeSurahsData[idx + 1];
                if (preloadedSurahId !== nextSurah.id) {
                    preloadAudioObj.src = nextSurah.url;
                    preloadAudioObj.preload = "auto";
                    preloadedSurahId = nextSurah.id;
                }
            }
        }
        
        // تحديث شريط تقدم الصوت في شاشة القفل كل ثانية
        const now = Date.now();
        if (now - lastPositionUpdateTime > 1000 && 'mediaSession' in navigator && navigator.mediaSession.setPositionState && audioInstance.duration !== Infinity) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: audioInstance.duration,
                    playbackRate: audioInstance.playbackRate,
                    position: audioInstance.currentTime
                });
                lastPositionUpdateTime = now;
            } catch(e) {}
        }
    }
};

function formatTime(s) { if(isNaN(s) || s === Infinity) return "00:00"; const m = Math.floor(s/60), sec = Math.floor(s%60); return `${m}:${sec < 10 ? '0'+sec : sec}`; }

let isDragging = false; 
let currentSeekPct = 0;
const progressContainer = document.getElementById('progress-container');

const seek = (e) => { 
    if (playingSurahId === 'radio') return currentSeekPct; 
    const rect = progressContainer.getBoundingClientRect(); 
    let clientX = 0;
    if (e.type.includes('touch')) {
        if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX;
        else if (e.changedTouches && e.changedTouches.length > 0) clientX = e.changedTouches[0].clientX;
    } else {
        clientX = e.clientX;
    }
    let pct = (clientX - rect.left) / rect.width; 
    pct = Math.max(0, Math.min(1, pct)); 
    document.getElementById('progress-bar-fill').style.width = (pct * 100) + '%'; 
    currentSeekPct = pct;
    return pct; 
};

const onDragMove = (e) => { if (isDragging) seek(e); };
const onDragEnd = (e) => { 
    if (isDragging) { 
        isDragging = false; 
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('touchmove', onDragMove);
        window.removeEventListener('touchend', onDragEnd);
        if(audioInstance.duration && audioInstance.duration !== Infinity) {
            audioInstance.currentTime = currentSeekPct * audioInstance.duration;
        }
    } 
};

if(progressContainer) {
    progressContainer.addEventListener('mousedown', (e) => { 
        if(playingSurahId==='radio') return; 
        isDragging = true; 
        seek(e); 
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
    });

    progressContainer.addEventListener('touchstart', (e) => { 
        if(playingSurahId==='radio') return; 
        isDragging = true; 
        seek(e); 
        window.addEventListener('touchmove', onDragMove, {passive: false});
        window.addEventListener('touchend', onDragEnd, {passive: false});
    }, {passive: false}); 

    progressContainer.addEventListener('click', (e) => { 
        if(playingSurahId !== 'radio' && audioInstance.duration && audioInstance.duration !== Infinity) {
            audioInstance.currentTime = seek(e) * audioInstance.duration;
        }
    });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => {
        const banner = document.getElementById('install-banner');
        if(banner) banner.classList.add('show');
    }, 2000); 
});

const installBtn = document.getElementById('install-action-btn');
if(installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            document.getElementById('install-banner').classList.remove('show');
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
        }
    });
}

window.addEventListener('appinstalled', () => {
    const banner = document.getElementById('install-banner');
    if(banner) banner.classList.remove('show');
    showToast(currentLang === 'ar' ? 'تم تثبيت التطبيق بنجاح!' : 'App installed successfully!');
});

// PWA Update Management
let newWorker;
if ('serviceWorker' in navigator) { 
    window.addEventListener('load', () => { 
        navigator.serviceWorker.register('sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        const updateToast = document.getElementById('update-toast');
                        if(updateToast) updateToast.classList.add('show');
                    }
                });
            });
        }).catch(err => console.log('SW failed')); 
    }); 
    
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}

function applyUpdate() {
    if (newWorker) {
        newWorker.postMessage({ action: 'skipWaiting' });
    }
}

(async () => {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if(themeBtn) themeBtn.innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun;
    setPlaybackMode('autonext'); 
    
    let targetSheikh = 'husary'; 
    const savedState = JSON.parse(localStorage.getItem('lastPlayedQuran'));
    
    const urlParams = new URLSearchParams(window.location.search);
    const reciterFromUrl = urlParams.get('sheikh'); 
    const listenFromUrl = urlParams.get('listen');

    if (listenFromUrl === 'radio') {
        playingSurahId = 'radio';
        isRadioHeaderActive = true;
    } else if (reciterFromUrl && recitersList.some(r => r.id === reciterFromUrl)) {
        targetSheikh = reciterFromUrl;
        if(savedState && savedState.sheikh === targetSheikh) {
            savedReciterEditions[targetSheikh] = savedState.edition;
            playingSheikhId = savedState.sheikh; 
            playingEditionId = savedState.edition; 
            playingSurahId = savedState.surah; 
        }
    } else if (savedState && savedState.sheikh) { 
        targetSheikh = savedState.sheikh; 
        savedReciterEditions[targetSheikh] = savedState.edition; 
        playingSheikhId = savedState.sheikh; 
        playingEditionId = savedState.edition; 
        playingSurahId = savedState.surah; 
    } else if (savedState && savedState.surah === 'radio') {
        playingSurahId = 'radio';
    }
    
    await selectSheikh(targetSheikh);

    if (listenFromUrl === 'radio') {
        playRadio();
    }

    if (!localStorage.getItem('radioDiscovered')) {
        setTimeout(() => {
            const rTooltip = document.getElementById('radio-tooltip');
            const rBadge = document.getElementById('radio-badge');
            if(rTooltip) rTooltip.classList.add('show');
            if(rBadge) rBadge.classList.add('show');
        }, 2500); 
    }

    if(savedState && savedState.surah && listenFromUrl !== 'radio') {
        if (savedState.surah === 'radio') {
            audioInstance.src = radioUrl;
            document.getElementById('global-player').style.display = 'block';
            document.getElementById('player-track-title').innerText = translations[currentLang].radioTitle;
            
            isRadioHeaderActive = true;
            updateHeaderUI();

            document.getElementById('progress-bar-fill').style.width = '100%';
            document.getElementById('progress-thumb').style.display = 'none';
            document.getElementById('time-separator').style.display = 'none';
            document.getElementById('curr-time').innerText = "";
            document.getElementById('total-time').innerText = translations[currentLang].live;
            syncUIWithAudioState();
        } else {
            const sData = activeSurahsData.find(s => s.id === savedState.surah);
            if(sData && audioInstance.src === "") {
                const sName = getSurahName(sData.id, sData.name);
                const promptText = currentLang === 'ar' ? `هل تود إكمال الاستماع إلى سورة ${sName}؟` : `Resume listening to Surah ${sName}?`;
                const rText = document.getElementById('resume-text');
                const rBanner = document.getElementById('resume-banner');
                if(rText && rBanner) {
                    rText.innerText = promptText;
                    rBanner.classList.add('show');
                    
                    window.resumeData = { id: sData.id, url: sData.url };
                    setTimeout(() => closeResumeBanner(), 15000);
                }
            }
        }
    }
})();