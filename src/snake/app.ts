import {directionType} from "./types"

export function start() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    const ctx = canvas.getContext("2d")
    const blockSize = 20
    const width = canvas.width
    const height = canvas.height
    const widthInBlocks = width / blockSize
    const heightInBlocks = height / blockSize
    let score = 0
    let snakeSpeed = 100
    const interval: NodeJS.Timeout[] = []

    // draw border
    const drawBorder = function () {
        if (ctx) {
            ctx.fillStyle = "Gray"
            ctx.fillRect(0, 0, width, blockSize)
            ctx.fillRect(0, height - blockSize, width, blockSize)
            ctx.fillRect(0, 0, blockSize, height)
            ctx.fillRect(width - blockSize, 0, blockSize, height)
        }
    }

    const drawBackGround = function () {
        if (ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
            ctx.fillRect(0, 0, width, height)
        }
    }

// draw score
    const drawScore = function () {
        if (ctx) {
            ctx.textBaseline = "top"
            ctx.fillStyle = "White"
            ctx.textAlign = "left"
            ctx.lineWidth = 5
            ctx.font = "20px Courier"
            ctx.fillText("Счет: " + score, blockSize, blockSize)
        }
    }

// draw gameOver
    const gameOver = function () {
        clearInterval(interval[0])
        if (ctx) {
            ctx.font = "60px Courier"
            ctx.fillStyle = "White"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("Конец игры", width / 2, height / 2)
        }
    }

    const startInterval = function (speed: number) {

        clearInterval(interval[0])
        interval.pop()

        const intervalId = setInterval(() => {
            drawBackGround()
            drawScore()
            snake.move()
            snake.draw()
            apple.draw()
            drawBorder()
        }, speed)
        interval.push(intervalId)

    }


// function for create circle - used in class block
    const circle = function (x: number, y: number, radius: number, fillCircle: boolean) {
        if (ctx) {
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2, false)
            if (fillCircle) {
                ctx.fill()
            } else {
                ctx.stroke()
            }
        }
    }


    // classes
    class Block {

        col: number
        row: number

        constructor(col: number, row: number) {
            this.col = col
            this.row = row
        }

        drawSquare() {
            let x = this.col * blockSize
            let y = this.row * blockSize
            if (ctx) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.fillRect(x, y, blockSize, blockSize)
            }

        }

        drawCircle(color: string) {
            let centerX = this.col * blockSize + blockSize / 2
            let centerY = this.row * blockSize + blockSize / 2
            if (ctx) {
                ctx.fillStyle = color
                circle(centerX, centerY, blockSize / 2, true)
            }
        }

        equal(otherBlock: Block) {
            return this.col === otherBlock.col && this.row === otherBlock.row
        }
    }

    class Snake {
        segments: Block[]
        speed: number
        direction: string
        nextDirection: string

        constructor() {
            this.segments = [
                new Block(7, 5),
                new Block(6, 5),
                new Block(5, 5),
            ]
            this.direction = "right"
            this.nextDirection = "right"
            this.speed = 100
        }


        draw() {
            for (let i = 0; i < this.segments.length; i++) {
                this.segments[i].drawSquare()
            }
        }

        move() {
            let head = this.segments[0]
            let newHead

            this.direction = this.nextDirection


            if (this.direction === "right") {
                newHead = new Block(head.col + 1, head.row)
            } else if (this.direction === "down") {
                newHead = new Block(head.col, head.row + 1)
            } else if (this.direction === "left") {
                newHead = new Block(head.col - 1, head.row)
            } else if (this.direction === "up") {
                newHead = new Block(head.col, head.row - 1)
            }

            if (newHead) {
                if (this.checkCollision(newHead)) {
                    gameOver()
                    return
                }
                this.segments.unshift(newHead)
                if (newHead.equal(apple.position)) {
                    score++
                    snakeSpeed -= 4
                    startInterval(snakeSpeed)
                    console.log(interval)
                    apple.move()
                } else {
                    this.segments.pop()
                }
            }
        }


        checkCollision(head: Block) {
            let leftCollision = head.col === 0
            let topCollision = head.row === 0
            let rightCollision = head.col === widthInBlocks - 1
            let bottomCollision = head.row === heightInBlocks - 1
            let wallCollision = leftCollision || topCollision ||
                rightCollision || bottomCollision
            let selfCollision = false

            for (let i = 0; i < this.segments.length; i++) {
                if (head.equal(this.segments[i])) {
                    selfCollision = true
                }
            }
            return wallCollision || selfCollision
        }


        setDirection(newDirection: string) {
            if (this.direction === "up" && newDirection === "down") {
                return
            } else if (this.direction === "right" && newDirection === "left") {
                return
            } else if (this.direction === "down" && newDirection === "up") {
                return
            } else if (this.direction === "left" && newDirection === "right") {
                return
            }
            this.nextDirection = newDirection
        }
    }

    class Apple {
        position: Block

        constructor() {
            this.position = new Block(10, 10)
        }

        draw() {
            this.position.drawCircle("LimeGreen")
        }

        move() {
            let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1
            let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1
            this.position = new Block(randomCol, randomRow)
        }
    }


    const snake = new Snake()
    const apple = new Apple()


    const directions: directionType = {
        "ArrowLeft": "left",
        "ArrowUp": "up",
        "ArrowRight": "right",
        "ArrowDown": "down"
    }


    window.addEventListener("keydown", (e: KeyboardEvent) => {
        const newDirection = directions[e.code]

        if (newDirection !== undefined) {
            snake.setDirection(newDirection);
        }

    })


    startInterval(snakeSpeed)
}






