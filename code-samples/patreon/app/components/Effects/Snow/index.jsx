import t from 'prop-types'
import React, { Component } from 'react'
import uniqueId from 'lodash/uniqueId'
import pull from 'lodash/pull'

import randomRange from 'utilities/random-range'
import requestAnimationFrame from 'utilities/request-animation-frame'
import Block from 'components/Layout/Block'

const imageMinSize = 5
const imageMaxSize = 30

const loadImage = (img, imgCache) => {
    const image = new Image()
    image.onload = () => {}
    image.src = img
    imgCache.push(image)
}

class Snow extends Component {
    constructor(props) {
        super(props)

        this.confettiSpriteIds = []
        this.confettiSprites = {}
        this.images = []

        this.state = {
            dpr: undefined,
            ctx: undefined,
        }

        props.snowImages.map(i => loadImage(i, this.images))
    }

    componentDidMount() {
        const canvas = this.canvas
        const dpr = window.devicePixelRatio || 1
        const ctx = canvas.getContext('2d')

        ctx.scale(dpr, dpr)
        this.setState({
            dpr: dpr,
            ctx: ctx,
        }) /* eslint react/no-did-mount-set-state: 0 */

        this.setCanvasSize(dpr)
        this.startRuntime()
        this.startSnow()
    }

    startSnow = () => {
        const {
            continuous,
            fireIntervalInSeconds,
            cannonFireCount,
            width,
        } = this.props

        let i = 0
        let triggerTimeLeft = randomRange(100, 200)
        const dynamicVelocity = width / 40
        while (i < cannonFireCount) {
            setTimeout(this.makeSnow(10, 300, dynamicVelocity), triggerTimeLeft)
            i++
            triggerTimeLeft *= 2
        }
        if (continuous) {
            setTimeout(this.startSnow, fireIntervalInSeconds * 1000)
        }
    }

    setCanvasSize(dpr) {
        const { width, height } = this.props
        this.canvas.width = width * dpr
        this.canvas.height = height * dpr
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    startRuntime() {
        const frameExec = tFrame => {
            const now = new Date().getTime()

            this.update(tFrame, now)
            this.draw(tFrame, now)

            requestAnimationFrame(frameExec)
        }
        frameExec()
    }

    makeSnow = (amount, angle, velocity) => {
        const { width } = this.props
        let i = 0
        while (i < amount) {
            const x = randomRange(0, width)
            const y = randomRange(-imageMaxSize, -imageMaxSize * 2)
            const r = randomRange(4, 6)
            const d = randomRange(15, 25)

            const id = uniqueId()
            const sprite = {
                [id]: {
                    angle,
                    velocity,
                    x,
                    y,
                    r,
                    d,
                },
            }

            this.confettiSprites = {
                ...this.confettiSprites,
                ...sprite,
            }
            this.confettiSpriteIds.push(id)
            this.initializeParticlePhysics(id)
            i++
        }
    }

    initializeParticlePhysics(id) {
        const { spread } = this.props

        const sprite = this.confettiSprites[id]
        const minAngle = sprite.angle - spread / 2
        const maxAngle = sprite.angle + spread / 2

        const minVelocity = sprite.velocity / 4
        const maxVelocity = sprite.velocity

        const velocity = randomRange(minVelocity, maxVelocity)
        const angle = randomRange(minAngle, maxAngle)
        const friction = randomRange(0.1, 0.25)

        const radians = angle * Math.PI / 180
        const velocityX = Math.cos(radians) * velocity * 3
        const velocityY = Math.sin(radians) * velocity / 2

        sprite.particleVelocityX = velocityX
        sprite.particleVelocityY = velocityY
        sprite.particleAngle = angle
        sprite.particleFriction = friction
        sprite.launchTime = new Date().getTime()
        sprite.imageSize = randomRange(imageMinSize, imageMaxSize)
        sprite.imageIndex = randomRange(0, this.images.length - 1)
    }

    update(tFrame, now) {
        const { decay } = this.props
        this.confettiSpriteIds.map(id => {
            const sprite = this.confettiSprites[id]
            const deltaTime = now - sprite.launchTime

            if (deltaTime >= decay * 1000) {
                pull(this.confettiSpriteIds, id)
                delete this.confettiSprites[id]
                return
            }

            this.updateSpritePosition(id, now)
            this.updateConfettiParticle(id)
        })
    }

    updateSpritePosition(id, now) {
        const { gravity } = this.props
        const sprite = this.confettiSprites[id]

        sprite.particleVelocityX =
            sprite.particleVelocityX -
            sprite.particleVelocityX * sprite.particleFriction
        sprite.particleVelocityY += gravity
        sprite.x += sprite.particleVelocityX
        sprite.y += sprite.particleVelocityY / 6
    }

    updateConfettiParticle(id) {
        const sprite = this.confettiSprites[id]
        sprite.x += Math.cos(sprite.angle) / 2
        sprite.y += Math.sin(sprite.angle + sprite.r / 2)
    }

    draw(tFrame, now) {
        const { ctx } = this.state
        if (!ctx || !this.canvas) return

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawConfetti()
    }

    drawConfetti() {
        this.confettiSpriteIds.map(id => {
            const sprite = this.confettiSprites[id]
            const { ctx } = this.state

            ctx.drawImage(
                this.images[sprite.imageIndex],
                sprite.x,
                sprite.y,
                sprite.imageSize,
                sprite.imageSize,
            )
            ctx.stroke()
        })
    }

    render() {
        const { onClick } = this.props
        return (
            <Block onClick={onClick} fluidHeight fluidWidth position="fixed">
                <canvas ref={ref => (this.canvas = ref)} />
            </Block>
        )
    }
}

Snow.propTypes = {
    cannonFireCount: t.number,
    continuous: t.bool,
    decay: t.number, // sec
    fireIntervalInSeconds: t.number,
    gravity: t.number,
    height: t.number,
    onClick: t.func,
    spread: t.number,
    width: t.number,
    snowImages: t.array,
}

Snow.defaultProps = {
    cannonFireCount: 5,
    continuous: true,
    decay: 10, // sec
    fireIntervalInSeconds: 4,
    gravity: 0.1,
    height: 800,
    onClick: undefined,
    spread: 60,
    width: 800,
    snowImages: [
        'https://emojipedia-us.s3.amazonaws.com/thumbs/320/apple/118/snowflake_2744.png',
    ],
}

export default Snow



// WEBPACK FOOTER //
// ./app/components/Effects/Snow/index.jsx