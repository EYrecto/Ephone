const fs = require('fs');

const brands = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Huawei', 'Honor', 'Motorola', 'Nokia', 'OnePlus', 'Google', 'Sony', 'Asus'];
const series = ['Galaxy', 'iPhone', 'Redmi', 'Reno', 'X', 'Narzo', 'Mate', 'Magic', 'Edge', 'Lumia', 'Nord', 'Pixel', 'Xperia', 'ROG'];
const modifiers = ['Pro', 'Max', 'Ultra', 'Plus', 'Lite', 'Mini', 'FE', 'SE', '5G', '4G', ''];

const rams = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '24GB'];
const storages = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];
const batteries = ['3000mAh', '3500mAh', '4000mAh', '4500mAh', '5000mAh', '5500mAh', '6000mAh', '7000mAh'];
const cameras = ['12MP', '16MP', '48MP', '50MP', '64MP', '108MP', '200MP'];
const screens = ['5.8"', '6.1"', '6.4"', '6.5"', '6.7"', '6.8"', '6.9"'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrice(ram, storage, brand) {
    let basePrice = 3000; // Base EGP
    
    // RAM factor
    const ramNum = parseInt(ram);
    basePrice += ramNum * 500;
    
    // Storage factor
    let storageNum = parseInt(storage);
    if (storage.includes('TB')) storageNum *= 1024;
    basePrice += storageNum * 15;
    
    // Brand premium
    if (brand === 'Apple' || brand === 'Samsung') basePrice += 5000;
    if (brand === 'Google' || brand === 'Sony') basePrice += 3000;
    
    // Random fluctuation
    basePrice += Math.floor(Math.random() * 2000) - 1000;
    
    return Math.max(2500, Math.round(basePrice / 100) * 100); // Round to nearest 100
}

function generatePhones(count) {
    const phones = [];
    let id = 1;
    
    while (phones.length < count) {
        const brand = getRandomItem(brands);
        let phoneName = brand;
        
        // Sometimes add a series
        if (Math.random() > 0.3) {
            phoneName += ' ' + getRandomItem(series);
        }
        
        // Add model number
        const modelNumber = Math.floor(Math.random() * 99) + 1;
        phoneName += ' ' + modelNumber;
        
        // Sometimes add a modifier
        const modifier = getRandomItem(modifiers);
        if (modifier) {
            phoneName += ' ' + modifier;
        }
        
        const ram = getRandomItem(rams);
        const storage = getRandomItem(storages);
        
        phones.push({
            id: id++,
            name: phoneName,
            brand: brand,
            specs: {
                ram: ram,
                storage: storage,
                battery: getRandomItem(batteries),
                camera: getRandomItem(cameras),
                screen: getRandomItem(screens),
                os: brand === 'Apple' ? 'iOS' : 'Android'
            },
            price: generatePrice(ram, storage, brand)
        });
    }
    
    return phones;
}

const numPhones = 5500;
const phonesData = generatePhones(numPhones);

fs.writeFileSync('phones.json', JSON.stringify(phonesData, null, 2));
console.log(`Successfully generated ${numPhones} phones and saved to phones.json`);
