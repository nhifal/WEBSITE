const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
    document.getElementById('reel4'),
    document.getElementById('reel5'),
    document.getElementById('reel6')
];
const spinButton = document.getElementById('spinButton');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');

let score = 0;
const visibleRows = 5; // Jumlah baris buah yang terlihat per reel
const fruitHeight = 120; // Tinggi setiap ikon buah di CSS
const spinDuration = 2000; // Durasi putaran per reel dalam ms

// Array of fruit icons (menggunakan simbol emoji dan warna placeholder)
const fruits = [
    { name: 'Ceri', value: 10, class: 'fruit-0', symbol: '🍒' },
    { name: 'Pisang', value: 20, class: 'fruit-1', symbol: '🍌' },
    { name: 'Apel', value: 30, class: 'fruit-2', symbol: '🍎' },
    { name: 'Jeruk', value: 40, class: 'fruit-3', symbol: '🍊' },
    { name: 'Semangka', value: 75, class: 'fruit-4', symbol: '🍉' },
    { name: 'Anggur', value: 100, class: 'fruit-5', symbol: '🍇' },
    { name: 'Belimbing', value: 150, class: 'fruit-6', symbol: '⭐' } // Buah langka/spesial
];

// Fungsi untuk mendapatkan buah acak
function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

// Fungsi untuk mengisi reel dengan banyak buah (untuk simulasi 5 baris)
function populateReel(reelElement) {
    const reelContent = document.createElement('div');
    reelContent.classList.add('reel-content');
    for (let i = 0; i < fruits.length * (visibleRows + 5); i++) {
        const fruit = getRandomFruit();
        const fruitDiv = document.createElement('div');
        fruitDiv.classList.add('fruit-icon', fruit.class);
        fruitDiv.textContent = fruit.symbol;
        reelContent.appendChild(fruitDiv);
    }
    reelElement.innerHTML = '';
    reelElement.appendChild(reelContent);
    return reelContent;
}

// Fungsi untuk memutar satu reel
function spinReel(reelElement, reelContent) {
    return new Promise(resolve => {
        reelContent.style.transform = `translateY(0px)`;
        reelContent.style.transition = `none`;
        void reelContent.offsetWidth; // Force reflow

        const finalFruitIndex = Math.floor(Math.random() * fruits.length);
        const finalFruit = fruits[finalFruitIndex];

        const numRotations = 3;
        const targetIndexInContent = (fruits.length * numRotations) + finalFruitIndex;
        const offsetToCenter = (visibleRows / 2 - 0.5) * fruitHeight;
        const finalPosition = -(targetIndexInContent * fruitHeight) + offsetToCenter;

        reelContent.style.transition = `transform ${spinDuration / 1000}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        reelContent.style.transform = `translateY(${finalPosition}px)`;

        setTimeout(() => {
            resolve(finalFruit);
        }, spinDuration);
    });
}

// Fungsi utama untuk memutar mesin
async function spinMachine() {
    spinButton.disabled = true;
    messageDisplay.textContent = 'MEMUTAR SISTEM...';
    messageDisplay.style.color = '#00FFFF'; // Warna teks saat berputar
    messageDisplay.classList.remove('win', 'lose'); // Hapus kelas sebelumnya

    const spinPromises = reels.map(reel => {
        const reelContent = populateReel(reel);
        return spinReel(reel, reelContent);
    });

    const results = await Promise.all(spinPromises);

    const winningFruits = results.slice(0, 3);

    if (winningFruits[0].name === winningFruits[1].name && winningFruits[1].name === winningFruits[2].name) {
        const winAmount = winningFruits[0].value;
        score += winAmount;
        scoreDisplay.textContent = score;
        messageDisplay.textContent = `JACKPOT! ALGORITMA TERPECAHKAN: 3 ${winningFruits[0].name} DI JALUR UTAMA! (+${winAmount} DATA POIN)`;
        messageDisplay.classList.add('win'); // Tambahkan kelas win
    } else {
        messageDisplay.textContent = 'OPERASI GAGAL. ALGORITMA TIDAK COCOK. COBA LAGI!';
        messageDisplay.classList.add('lose'); // Tambahkan kelas lose
    }

    spinButton.disabled = false;
}

// Event listener for the spin button
spinButton.addEventListener('click', spinMachine);

// Initialize the machine with fruits on load
function initializeMachine() {
    reels.forEach(reel => {
        populateReel(reel);
    });
}

initializeMachine();