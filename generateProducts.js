// generateProducts.js
// Script to generate random products for all categories
const fs = require('fs');
const path = require('path');

const categories = [
  {
    name: 'Desktops',
    images: ['desktop1.jpg', 'desktop2.jpg', 'desktop3.jpg', 'desktop4.jpg'],
    specs: [
      ['Intel Core i5', '8GB RAM', '1TB HDD', 'Windows 11 Home'],
      ['Intel Core i7', '16GB RAM', '512GB SSD', 'Windows 11 Pro'],
      ['AMD Ryzen 5', '12GB RAM', '1TB HDD', 'Windows 10'],
      ['Intel Core i3', '8GB RAM', '256GB SSD', 'Windows 11 Home'],
    ],
  },
  {
    name: 'Laptops',
    images: ['laptop1.jpg', 'laptop2.jpg', 'laptop3.jpg', 'laptop4.jpg'],
    specs: [
      ['Apple M2 Chip', '8GB RAM', '256GB SSD', 'macOS Sonoma'],
      ['Intel Core i5', '16GB RAM', '512GB SSD', 'Windows 11 Pro'],
      ['Intel Core i7', '16GB RAM', '1TB SSD', 'Windows 11 Home'],
      ['Intel Core i7', '16GB RAM', '512GB SSD', 'Windows 11 Pro'],
    ],
  },
  {
    name: 'Mobiles',
    images: ['mobile1.jpg', 'mobile2.jpg', 'mobile3.jpg', 'mobile4.jpg'],
    specs: [
      ['6.1-inch OLED', 'A16 Bionic Chip', '128GB Storage', 'iOS 17'],
      ['6.2-inch AMOLED', 'Exynos 2400', '256GB Storage', 'Android 14'],
      ['6.7-inch AMOLED', 'Snapdragon 8 Gen 2', '256GB Storage', 'Android 14'],
      ['6.3-inch OLED', 'Google Tensor G3', '128GB Storage', 'Android 14'],
    ],
  },
];

const productNames = {
  Desktops: ['Dell Inspiron Desktop', 'HP Pavilion Desktop', 'Acer Aspire TC', 'Lenovo IdeaCentre', 'MSI Pro DP21', 'ASUS ExpertCenter', 'Apple iMac', 'CyberPowerPC Gamer Xtreme'],
  Laptops: ['Apple MacBook Air', 'Lenovo ThinkPad', 'HP Envy x360', 'Dell XPS 13', 'Acer Swift 3', 'ASUS ZenBook', 'Microsoft Surface Laptop', 'Razer Blade Stealth'],
  Mobiles: ['iPhone 15', 'Samsung Galaxy S24', 'OnePlus 12', 'Google Pixel 8', 'Xiaomi 13 Pro', 'Oppo Find X6', 'Vivo X90', 'Sony Xperia 1 V'],
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProducts(countPerCategory = 8) {
  let id = 1;
  const products = [];
  for (const cat of categories) {
    for (let i = 0; i < countPerCategory; i++) {
      const name = productNames[cat.name][i % productNames[cat.name].length];
      const image = `/images/${cat.images[i % cat.images.length]}`;
      const specs = cat.specs[i % cat.specs.length];
      const price = getRandomInt(400, 1500) + 0.99;
      products.push({
        id: id++,
        title: name,
        price,
        image,
        category: cat.name,
        specs,
      });
    }
  }
  return products;
}

const products = generateProducts(8);
const outputPath = path.join(__dirname, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Generated ${products.length} products to products.json`);
