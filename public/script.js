class DinoGame {
            constructor() {
                this.gameContainer = document.getElementById('gameContainer');
                this.dino = document.getElementById('dino');
                this.ground = document.getElementById('ground');
                this.scoreElement = document.getElementById('score');
                this.gameOverElement = document.getElementById('gameOver');
                
                this.isRunning = false;
                this.isJumping = false;
                this.isDucking = false;
                this.score = 0;
                this.speed = 4;
                this.obstacles = [];
                this.clouds = [];
                
                this.gameLoop = null;
                this.obstacleSpawnTimer = null;
                
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.startGame();
            }
            
            setupEventListeners() {
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space' || e.code === 'ArrowUp') {
                        e.preventDefault();
                        if (!this.isRunning) {
                            this.restartGame();
                        } else if (!this.isJumping && !this.isDucking) {
                            this.jump();
                        }
                    }
                    
                    if (e.code === 'ArrowDown') {
                        e.preventDefault();
                        if (this.isRunning && !this.isJumping) {
                            this.duck();
                        }
                    }
                });
                
                document.addEventListener('keyup', (e) => {
                    if (e.code === 'ArrowDown') {
                        this.stopDuck();
                    }
                });
                
                // Mobile touch events
                this.gameContainer.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (!this.isRunning) {
                        this.restartGame();
                    } else if (!this.isJumping && !this.isDucking) {
                        this.jump();
                    }
                });
            }
            
            startGame() {
                this.isRunning = true;
                this.score = 0;
                this.speed = 4;
                this.obstacles = [];
                this.updateScore();
                
                this.gameLoop = setInterval(() => {
                    this.update();
                }, 16);
                
                this.obstacleSpawnTimer = setInterval(() => {
                    this.spawnObstacle();
                }, 1500);
            }
            
            update() {
                this.updateScore();
                this.moveObstacles();
                this.checkCollisions();
                this.increaseSpeed();
            }
            
            updateScore() {
                this.score += 1;
                this.scoreElement.textContent = this.score.toString().padStart(5, '0');
            }
            
            jump() {
                    if (this.isJumping || this.isDucking) return;

                    this.isJumping = true;

                    const gravity = 0.5;
                    const jumpStrength = 10;
                    let velocity = jumpStrength;
                    let position = parseFloat(this.dino.style.bottom) || 12;

                    const jumpInterval = setInterval(() => {
                        position += velocity;
                        velocity -= gravity;

                        if (position <= 12) {
                            position = 0; // fix exact to ground level
                            this.dino.style.bottom = `${position}px`;
                            clearInterval(jumpInterval);
                            this.isJumping = false;
                        } else {
                            this.dino.style.bottom = `${position}px`;
                        }
                    }, 16); // 60 FPS
                }


            
            duck() {
                if (this.isJumping) return;
                
                this.isDucking = true;
                this.dino.classList.add('duck');
            }
            
            stopDuck() {
                this.isDucking = false;
                this.dino.classList.remove('duck');
            }
            
            spawnObstacle() {
                if (!this.isRunning) return;
                
                const obstacleType = Math.random() < 0.7 ? 'cactus' : 'pterodactyl';
                const obstacle = document.createElement('div');
                
                if (obstacleType === 'cactus') {
                    obstacle.className = Math.random() < 0.5 ? 'cactus' : 'cactus large';
                    obstacle.style.right = '0px';
                    obstacle.style.bottom = '12px';
                } else {
                    obstacle.className = 'pterodactyl';
                    obstacle.style.right = '0px';
                    obstacle.style.bottom = Math.random() < 0.5 ? '30px' : '60px';
                }
                
                this.gameContainer.appendChild(obstacle);
                this.obstacles.push({
                    element: obstacle,
                    x: 600
                });
            }
            
            moveObstacles() {
                this.obstacles.forEach((obstacle, index) => {
                    obstacle.x -= this.speed;
                    obstacle.element.style.right = (600 - obstacle.x) + 'px';
                    
                    if (obstacle.x < -50) {
                        obstacle.element.remove();
                        this.obstacles.splice(index, 1);
                    }
                });
            }
            
            checkCollisions() {
              const dinoRect = this.dino.getBoundingClientRect();

              this.obstacles.forEach(obstacle => {
                const obstacleRect = obstacle.element.getBoundingClientRect();

                if (
                  dinoRect.left + 5 < obstacleRect.right &&
                  dinoRect.right - 5 > obstacleRect.left &&
                  dinoRect.top + 5 < obstacleRect.bottom &&
                  dinoRect.bottom - 5 > obstacleRect.top
                ) {
                  this.gameOver();
                }
              });
            }

            
            isColliding(rect1, rect2) {
                return rect1.x < rect2.x + rect2.width &&
                       rect1.x + rect1.width > rect2.x &&
                       rect1.y < rect2.y + rect2.height &&
                       rect1.y + rect1.height > rect2.y;
            }
            
            increaseSpeed() {
                if (this.score % 500 === 0 && this.speed < 12) {
                    this.speed += 0.5;
                }
            }
            
            gameOver() {
                this.isRunning = false;
                clearInterval(this.gameLoop);
                clearInterval(this.obstacleSpawnTimer);
                
                // Pause all animations
                this.ground.classList.add('pause');
                document.querySelectorAll('.cloud').forEach(cloud => {
                    cloud.classList.add('pause');
                });
                document.querySelectorAll('.pterodactyl').forEach(ptero => {
                    ptero.classList.add('pause');
                });
                
                this.gameOverElement.style.display = 'block';
            }
            
            restartGame() {
                // Remove all obstacles
                this.obstacles.forEach(obstacle => {
                    obstacle.element.remove();
                });
                this.obstacles = [];
                
                // Reset dino
                this.dino.classList.remove('jump', 'duck');
                this.isJumping = false;
                this.isDucking = false;
                
                // Resume animations
                this.ground.classList.remove('pause');
                document.querySelectorAll('.cloud').forEach(cloud => {
                    cloud.classList.remove('pause');
                });
                
                // Hide game over screen
                this.gameOverElement.style.display = 'none';
                
                // Restart game
                this.startGame();
            }
        }
        
        // Initialize game when page loads
        window.addEventListener('load', () => {
            new DinoGame();
        });