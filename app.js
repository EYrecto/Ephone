// Data Generation
const brands = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Huawei', 'Honor', 'Motorola', 'Nokia', 'OnePlus', 'Google', 'Sony', 'Asus', 'Infinix', 'Tecno'];
const series = ['Galaxy', 'iPhone', 'Redmi', 'Reno', 'X', 'Narzo', 'Mate', 'Magic', 'Edge', 'Lumia', 'Nord', 'Pixel', 'Xperia', 'ROG', 'Note', 'Zero'];
const modifiers = ['Pro', 'Max', 'Ultra', 'Plus', 'Lite', 'Mini', 'FE', 'SE', '5G', '4G', ''];

const rams = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '24GB'];
const storages = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
const batteries = ['3000mAh', '3500mAh', '4000mAh', '4500mAh', '5000mAh', '5500mAh', '6000mAh', '7000mAh'];
const cameras = ['12MP', '16MP', '48MP', '50MP', '64MP', '108MP', '200MP'];
const screens = ['5.8"', '6.1"', '6.4"', '6.5"', '6.7"', '6.8"', '6.9"'];
const processors = ['Snapdragon 8 Gen 3', 'A17 Pro', 'Dimensity 9300', 'Exynos 2400', 'Tensor G3', 'Snapdragon 7+ Gen 2', 'Helio G99', 'Snapdragon 680'];
const displayTechs = ['AMOLED', 'OLED', 'Super AMOLED', 'IPS LCD', 'LTPO OLED'];
const refreshRates = ['60Hz', '90Hz', '120Hz', '144Hz', '165Hz'];
const chargings = ['15W', '20W', '25W', '33W', '45W', '67W', '120W', '240W'];
const weights = ['160g', '175g', '185g', '195g', '210g', '225g', '240g'];
const colorsArray = ['أسود', 'أبيض', 'فضي', 'أزرق', 'أخضر', 'ذهبي', 'بنفسجي', 'تيتانيوم'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomColors() {
    const numColors = Math.floor(Math.random() * 3) + 2; // 2 to 4 colors
    const selected = [];
    for(let i = 0; i < numColors; i++) {
        let color = getRandomItem(colorsArray);
        if(!selected.includes(color)) selected.push(color);
    }
    return selected.join('، ');
}

function generatePrice(ram, storage, brand) {
    let basePrice = 3000;
    
    const ramNum = parseInt(ram);
    basePrice += ramNum * 600;
    
    let storageNum = parseInt(storage);
    if (storage.includes('TB')) storageNum *= 1024;
    basePrice += storageNum * 20;
    
    if (brand === 'Apple' || brand === 'Samsung') basePrice += 6000;
    if (brand === 'Google' || brand === 'Sony') basePrice += 4000;
    if (brand === 'Xiaomi' || brand === 'Oppo' || brand === 'Vivo') basePrice -= 1000;
    
    basePrice += Math.floor(Math.random() * 2000) - 1000;
    
    return Math.max(3000, Math.round(basePrice / 100) * 100);
}

function generatePhones(count) {
    const phones = [];
    let id = 1;
    
    while (phones.length < count) {
        const brand = getRandomItem(brands);
        let phoneName = brand;
        
        if (Math.random() > 0.2) {
            phoneName += ' ' + getRandomItem(series);
        }
        
        const modelNumber = Math.floor(Math.random() * 99) + 1;
        phoneName += ' ' + modelNumber;
        
        const modifier = getRandomItem(modifiers);
        if (modifier) {
            phoneName += ' ' + modifier;
        }
        
        const ram = getRandomItem(rams);
        const storage = getRandomItem(storages);
        
        // Define images based on OS/Brand (Using generic unsplash smartphone placeholders)
        const isApple = brand === 'Apple';
        // Front image: a generic phone front. Back image: a generic phone back.
        // I will use reliable image URLs from unsplash that look like phones.
        const frontImage = isApple ? 
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop' : // generic phone front
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop'; // another phone front
            
        const backImage = isApple ? 
            'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=500&auto=format&fit=crop' : // iphone back
            'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=500&auto=format&fit=crop'; // samsung back
            
        phones.push({
            id: id++,
            name: phoneName,
            brand: brand,
            images: {
                front: frontImage,
                back: backImage
            },
            specs: {
                ram: ram,
                storage: storage,
                battery: getRandomItem(batteries),
                camera: getRandomItem(cameras),
                screen: getRandomItem(screens),
                os: isApple ? 'iOS' : 'Android',
                processor: getRandomItem(processors),
                display: getRandomItem(displayTechs),
                refresh: getRandomItem(refreshRates),
                charging: getRandomItem(chargings),
                weight: getRandomItem(weights),
                colors: getRandomColors()
            },
            price: generatePrice(ram, storage, brand)
        });
    }
    
    return phones;
}

// App State
let allPhones = [];
let filteredPhones = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 24;

// DOM Elements
const phoneGrid = document.getElementById('phoneGrid');
const loading = document.getElementById('loading');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const brandFilter = document.getElementById('brandFilter');
const ramFilter = document.getElementById('ramFilter');
const sortFilter = document.getElementById('sortFilter');
const resultCount = document.getElementById('resultCount');
const modal = document.getElementById('phoneModal');
const modalDetails = document.getElementById('modalDetails');
const closeBtn = document.querySelector('.close-btn');

// Intro Elements
const introOverlay = document.getElementById('introOverlay');
const openWebBtn = document.getElementById('openWebBtn');

// Initialization
function init() {
    // Lock scroll for intro
    document.body.classList.add('no-scroll');
    
    // Generate 5200 phones
    allPhones = generatePhones(5200);
    filteredPhones = [...allPhones];
    
    populateBrands();
    setupEventListeners();
    
    loading.classList.add('hidden');
    phoneGrid.classList.remove('hidden');
    
    renderPage();
}

function populateBrands() {
    brands.sort().forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

function setupEventListeners() {
    // Intro Event
    openWebBtn.addEventListener('click', () => {
        introOverlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        // setTimeout(() => introOverlay.style.display = 'none', 800);
    });

    // Filters
    searchInput.addEventListener('input', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    brandFilter.addEventListener('change', applyFilters);
    ramFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    
    // Modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedBrand = brandFilter.value;
    const selectedRam = ramFilter.value;
    const sortMode = sortFilter.value;
    
    filteredPhones = allPhones.filter(phone => {
        const matchSearch = phone.name.toLowerCase().includes(searchTerm) || 
                            phone.brand.toLowerCase().includes(searchTerm);
        const matchBrand = selectedBrand === 'all' || phone.brand === selectedBrand;
        const matchRam = selectedRam === 'all' || phone.specs.ram === selectedRam;
        
        return matchSearch && matchBrand && matchRam;
    });
    
    if (sortMode === 'price-asc') {
        filteredPhones.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price-desc') {
        filteredPhones.sort((a, b) => b.price - a.price);
    }
    
    currentPage = 1;
    renderPage();
}

function renderPage() {
    phoneGrid.innerHTML = '';
    
    const totalItems = filteredPhones.length;
    resultCount.textContent = `تم العثور على ${totalItems.toLocaleString('ar-EG')} هاتف`;
    
    if (totalItems === 0) {
        phoneGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">لا توجد نتائج مطابقة للبحث</div>';
        pagination.innerHTML = '';
        return;
    }
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    const pageItems = filteredPhones.slice(startIndex, endIndex);
    
    pageItems.forEach(phone => {
        const card = document.createElement('div');
        card.className = 'phone-card';
        
        const formatPrice = phone.price.toLocaleString('ar-EG');
        
        card.innerHTML = `
            <div class="brand-badge">${phone.brand}</div>
            <div class="phone-card-image">
                <img src="${phone.images.front}" alt="${phone.name} Front" loading="lazy">
            </div>
            <h3 class="phone-name">${phone.name}</h3>
            <div class="phone-specs-mini">
                <div class="spec-item"><i class="fas fa-memory"></i> ${phone.specs.ram}</div>
                <div class="spec-item"><i class="fas fa-hdd"></i> ${phone.specs.storage}</div>
            </div>
            <div class="phone-footer">
                <div>
                    <span class="price">${formatPrice}</span>
                    <span class="currency">ج.م</span>
                </div>
                <button class="details-btn" onclick="showDetails(${phone.id})">التفاصيل</button>
            </div>
        `;
        phoneGrid.appendChild(card);
    });
    
    renderPagination(totalItems);
}

function renderPagination(totalItems) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { if(currentPage > 1) { currentPage--; renderPage(); window.scrollTo({top: window.innerHeight, behavior: 'smooth'}); }};
    pagination.appendChild(prevBtn);
    
    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
        addPageButton(totalPages);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { if(currentPage < totalPages) { currentPage++; renderPage(); window.scrollTo({top: window.innerHeight, behavior: 'smooth'}); }};
    pagination.appendChild(nextBtn);
}

function addPageButton(pageNumber) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${pageNumber === currentPage ? 'active' : ''}`;
    btn.textContent = pageNumber;
    btn.onclick = () => {
        currentPage = pageNumber;
        renderPage();
        window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
    };
    pagination.appendChild(btn);
}

window.showDetails = function(id) {
    const phone = allPhones.find(p => p.id === id);
    if (!phone) return;
    
    const formatPrice = phone.price.toLocaleString('ar-EG');
    
    modalDetails.innerHTML = `
        <div class="modal-images-container">
            <div class="modal-image-wrapper">
                <div class="modal-image-box">
                    <img src="${phone.images.front}" alt="${phone.name} الوجه الأمامي">
                </div>
                <div class="modal-image-label">الواجهة الأمامية</div>
            </div>
            <div class="modal-image-wrapper">
                <div class="modal-image-box">
                    <img src="${phone.images.back}" alt="${phone.name} الوجه الخلفي">
                </div>
                <div class="modal-image-label">الواجهة الخلفية</div>
            </div>
        </div>
        
        <div class="modal-info">
            <div class="modal-header-text">
                <div class="modal-brand">${phone.brand}</div>
                <h2 class="modal-name">${phone.name}</h2>
                <div class="modal-price">${formatPrice} ج.م</div>
            </div>
            
            <div class="specs-grid">
                <div class="spec-box">
                    <i class="fas fa-microchip"></i>
                    <div class="label">المعالج</div>
                    <div class="value">${phone.specs.processor}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-memory"></i>
                    <div class="label">الرام</div>
                    <div class="value">${phone.specs.ram}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-hdd"></i>
                    <div class="label">التخزين</div>
                    <div class="value">${phone.specs.storage}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-camera"></i>
                    <div class="label">الكاميرا الأساسية</div>
                    <div class="value">${phone.specs.camera}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-battery-full"></i>
                    <div class="label">البطارية</div>
                    <div class="value">${phone.specs.battery}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-bolt"></i>
                    <div class="label">سرعة الشحن</div>
                    <div class="value">${phone.specs.charging}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-mobile-alt"></i>
                    <div class="label">الشاشة</div>
                    <div class="value">${phone.specs.screen} ${phone.specs.display}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-tachometer-alt"></i>
                    <div class="label">معدل التحديث</div>
                    <div class="value">${phone.specs.refresh}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-cogs"></i>
                    <div class="label">نظام التشغيل</div>
                    <div class="value">${phone.specs.os}</div>
                </div>
                <div class="spec-box">
                    <i class="fas fa-weight-hanging"></i>
                    <div class="label">الوزن</div>
                    <div class="value">${phone.specs.weight}</div>
                </div>
                <div class="spec-box" style="grid-column: 1 / -1;">
                    <i class="fas fa-palette"></i>
                    <div class="label">الألوان المتوفرة</div>
                    <div class="value">${phone.specs.colors}</div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
};

// Start App
setTimeout(init, 500);
