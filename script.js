const wheelCanvas = document.getElementById("wheel");
const ctx = wheelCanvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const totalWinsElement = document.getElementById("totalWins");
const spinsLeftElement = document.getElementById("spinsLeft");
const timerElement = document.getElementById("timer");

const sectors = [
    "0.001 SVX",
    "0.005 SVX",
    "0.01 SVX",
    "0.05 SVX",
    "0.1 SVX",
    "0.5 SVX",
    "1 SVX",
    "Double",
    "0 SVX"
];
const sectorColors = ["#FF5733", "#FFBD33", "#75FF33", "#33FF57", "#33FFBD", "#3375FF", "#6F33FF", "#FF33A6", "#A6A6A6"];
const spinDuration = 5000; // тривалість обертання у мс
let spinsLeft = 3;
let totalWins = 0;
let lastSpinTime = localStorage.getItem("lastSpinTime") || 0;
let currentRotation = 0; // Поточний кут обертання

// Зберігаємо результати в локальному сховищі
function saveState() {
    localStorage.setItem("totalWins", totalWins);
    localStorage.setItem("spinsLeft", spinsLeft);
    localStorage.setItem("lastSpinTime", Date.now());
    localStorage.setItem("currentRotation", currentRotation);
}

// Завантажуємо результати зі сховища
function loadState() {
    totalWins = parseFloat(localStorage.getItem("totalWins")) || 0;
    spinsLeft = parseInt(localStorage.getItem("spinsLeft")) || 3;
    lastSpinTime = parseInt(localStorage.getItem("lastSpinTime")) || 0;
    currentRotation = parseFloat(localStorage.getItem("currentRotation")) || 0;
    totalWinsElement.textContent = totalWins.toFixed(3);
    spinsLeftElement.textContent = spinsLeft;
}

function drawWheel() {
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = wheelCanvas.width / 2;

    const anglePerSector = (2 * Math.PI) / sectors.length;

    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);  // Очищаємо попереднє відображення

    // Малюємо сектори
    for (let i = 0; i < sectors.length; i++) {
        const startAngle = i * anglePerSector + currentRotation;
        const endAngle = startAngle + anglePerSector;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = sectorColors[i];
        ctx.fill();
        ctx.stroke();

        // Додаємо текст
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSector / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(sectors[i], radius - 20, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinsLeft <= 0) return;

    const spins = Math.floor(Math.random() * 5) + 5; // Кількість обертів
    const randomSector = Math.floor(Math.random() * sectors.length); // Випадковий сектор
    const endAngle = randomSector * ((2 * Math.PI) / sectors.length);

    const startTime = Date.now();
    const endTime = startTime + spinDuration;

    function animate() {
        const currentTime = Date.now();
        const remainingTime = Math.max(0, endTime - currentTime);
        const progress = 1 - remainingTime / spinDuration;

        currentRotation = spins * (2 * Math.PI) * progress + endAngle;
        drawWheel();

        if (remainingTime > 0) {
            requestAnimationFrame(animate);
        } else {
            processResult(randomSector);
        }
    }

    animate();
}

function processResult(sectorIndex) {
    const result = sectors[sectorIndex];
    if (result === "Double") {
        totalWins *= 2;
    } else {
        const winValue = parseFloat(result.split(" ")[0]);
        totalWins += winValue;
    }

    spinsLeft--;
    saveState();
    updateUI();
}

function updateUI() {
    totalWinsElement.textContent = totalWins.toFixed(3);
    spinsLeftElement.textContent = spinsLeft;

    if (spinsLeft <= 0) {
        const nextSpinTime = lastSpinTime + 3 * 60 * 60 * 1000; // 3 години
        const interval = setInterval(() => {
            const now = Date.now();
            const remainingTime = Math.max(0, nextSpinTime - now);

            if (remainingTime === 0) {
                clearInterval(interval);
                spinsLeft = 3;
                saveState();
                updateUI();
            }

            const hours = Math.floor(remainingTime / (60 * 60 * 1000));
            const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

            timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 1000);
    } else {
        timerElement.textContent = "00:00:00";
    }
}

// Початкова ініціалізація
loadState();
drawWheel();

spinButton.addEventListener("click", spinWheel);
