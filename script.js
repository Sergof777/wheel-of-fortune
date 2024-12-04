const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const segments = ['Приз 1', 'Приз 2', 'Приз 3', 'Приз 4'];
let angle = 0;

function drawWheel() {
    const segmentAngle = (2 * Math.PI) / segments.length;
    segments.forEach((segment, index) => {
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, segmentAngle * index, segmentAngle * (index + 1));
        ctx.fillStyle = index % 2 === 0 ? '#f1c40f' : '#e74c3c';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(segment, 250, 150);
    });
}

drawWheel();

document.getElementById('spin').addEventListener('click', () => {
    angle += Math.random() * 360 + 720; // крутити мінімум 2 оберти
    canvas.style.transform = `rotate(${angle}deg)`;
});
