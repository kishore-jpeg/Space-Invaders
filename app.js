const grid = document.querySelector(".grid")
let currentShooterIndex = 202;
let width = 15
let direction = 1
let goingRight = true
let invadersId 
let aliensRemoved = []
let results = 0
const resultsDisplay = document.querySelector("#result")
for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))

const alieninvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
    for (let i = 0; i < alieninvaders.length; i++) {
        if(!aliensRemoved.includes(i)){

            squares[alieninvaders[i]].classList.add("invaders")
        }
    }
}

draw()

function remove() {
    for (let i = 0; i < alieninvaders.length; i++) {
        squares[alieninvaders[i]].classList.remove("invaders")
    }
}

squares[currentShooterIndex].classList.add("shooter")

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alieninvaders[0] % width === 0
    const rightEdge = alieninvaders[alieninvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alieninvaders.length; i++) {
            alieninvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alieninvaders.length; i++) {
            alieninvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }



    for (let i = 0; i < alieninvaders.length; i++) {
        alieninvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invaders", "shooter")) {
        resultsDisplay.innerHTML = 'game over'
        clearInterval(invadersId)

    }

    for (let i = 0; i < alieninvaders.length; i++) {
        if (alieninvaders[i] > squares.length) {
            resultsDisplay.innerHTML = 'game over'
            clearInterval(invadersId)
        }
    }
    if(aliensRemoved.length === alieninvaders.length){
         resultsDisplay.innerHTML = "You win!"
         clearInterval(invadersId)
    }
}

invadersId = setInterval(moveInvaders, 300)

function shoot(e) {
    let lasterId
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if(squares[currentLaserIndex].classList.contains("invaders")){
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invaders")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(()=> squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(lasterId)

            const alienRemoved = alieninvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
        }
    }
    switch (e.key) {
        case 'ArrowUp':
            lasterId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)