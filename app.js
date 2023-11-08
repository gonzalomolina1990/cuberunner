const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

player.position.y = -1;
camera.position.z = 5;

let timer = 0;
let score = 0;
let isGameOver = false;

function createObstacle(targetPlayer) {


    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const randomColor = Math.floor(Math.random() * 16777215);
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: randomColor });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

    if (targetPlayer) {
        obstacle.position.x = player.position.x;
        obstacle.position.y = player.position.y;
    } else {
        obstacle.position.x = Math.random() * 10 - 5;
        obstacle.position.y = Math.random() * 2 - 1;
    }
    obstacle.position.z = -Math.random() * 50 - 10;

    scene.add(obstacle);
    return obstacle;
}

function updateScore() {
    document.getElementById('score-display').innerText = 'Score: ' + score;
}

function resetGame() {
    location.reload();
}

let obstacles = [];

function animate() {
    if (isGameOver) return;

    requestAnimationFrame(animate);

    timer++;

    if (timer % 60 === 0) {
        score++;
        updateScore();
    }

    const speedIncrease = 1 + score * 0.02;

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.z += 0.15 * speedIncrease;

        if (obstacles[i].position.distanceTo(player.position) < 1) {
            console.log("Game Over!");
            isGameOver = true;
            document.getElementById('restart-button').style.display = 'block';
        }
    }

    while (obstacles.length < 10 + score) {
        const targetPlayer = timer % 60 === 0;
        obstacles.push(createObstacle(targetPlayer));
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            player.position.x = Math.max(player.position.x - 0.5, -4);
            break;
        case 'ArrowRight':
            player.position.x = Math.min(player.position.x + 0.5, 4);
            break;
        case 'ArrowUp':
            player.position.y = Math.min(player.position.y + 0.5, 1);
            break;
        case 'ArrowDown':
            player.position.y = Math.max(player.position.y - 0.5, -3);
            break;
    }
});

document.getElementById('restart-button').addEventListener('click', resetGame);