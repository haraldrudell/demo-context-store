import t from 'prop-types'
import React, { Component } from 'react'
import uniqueId from 'lodash/uniqueId'
import pull from 'lodash/pull'

import randomRange from 'utilities/random-range'
import requestAnimationFrame from 'utilities/request-animation-frame'
import Block from 'components/Layout/Block'

import themeColors from 'styles/themes/america/colors'

class Confetti extends Component {
    constructor(props) {
        super(props)

        this.confettiSpriteIds = []
        this.confettiSprites = {}

        this.state = {
            dpr: undefined,
            ctx: undefined,
        }
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
        this.triggerConfettiCannons()
    }

    triggerConfettiCannons() {
        const {
            continuous,
            fireIntervalInSeconds,
            cannonFireCount,
            width,
            height,
        } = this.props

        let i = 0
        let triggerTimeLeft = randomRange(100, 200)
        let triggerTimeRight = randomRange(100, 200)
        const dynamicVelocity = width / 40
        while (i < cannonFireCount) {
            setTimeout(
                this.spawnConfettiBlast.bind(
                    this,
                    10,
                    300,
                    dynamicVelocity,
                    0,
                    height / 6,
                ),
                triggerTimeLeft,
            )
            setTimeout(
                this.spawnConfettiBlast.bind(
                    this,
                    10,
                    210,
                    dynamicVelocity,
                    width,
                    height / 6,
                ),
                triggerTimeRight,
            )
            i++
            triggerTimeLeft *= 2
            triggerTimeRight *= 2
        }
        if (continuous) {
            setTimeout(
                this.triggerConfettiCannons.bind(this),
                fireIntervalInSeconds * 1000,
            )
        }
    }

    triggerConfettiCannon() {
        const amount = 20
        const angle = 0
        const velocity = 20
        const x = 300
        const y = 400
        this.spawnConfettiBlast(amount, angle, velocity, x, y)
        setTimeout(this.triggerConfettiCannon.bind(this), 1000)
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

    spawnConfettiBlast(amount, angle, velocity, x, y) {
        const { colors } = this.props
        let i = 0
        while (i < amount) {
            const r = randomRange(4, 6)
            const d = randomRange(15, 25)
            const color = colors[Math.floor(Math.random() * colors.length)]

            const tilt = randomRange(10, -10)
            const tiltAngleIncremental = randomRange(0.07, 0.03)
            const tiltAngle = 0

            const id = uniqueId()
            const sprite = {
                [id]: {
                    angle,
                    velocity,
                    x,
                    y,
                    r,
                    d,
                    color,
                    tilt,
                    tiltAngleIncremental,
                    tiltAngle,
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
        sprite.y += sprite.particleVelocityY / 4
    }

    updateConfettiParticle(id) {
        const sprite = this.confettiSprites[id]
        const tiltAngle = 0.0005 * sprite.d

        sprite.angle += 0.01
        sprite.tiltAngle += tiltAngle
        sprite.tiltAngle += sprite.tiltAngleIncremental
        sprite.tilt = Math.sin(sprite.tiltAngle - sprite.r / 2) * sprite.r * 2
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

            ctx.beginPath()
            ctx.lineWidth = sprite.d / 2
            ctx.strokeStyle = sprite.color
            ctx.moveTo(sprite.x + sprite.tilt + sprite.r, sprite.y)
            ctx.lineTo(
                sprite.x + sprite.tilt,
                sprite.y + sprite.tilt + sprite.r,
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

Confetti.propTypes = {
    cannonFireCount: t.number,
    colors: t.array,
    continuous: t.bool,
    decay: t.number, // sec
    fireIntervalInSeconds: t.number,
    gravity: t.number,
    height: t.number,
    onClick: t.func,
    spread: t.number,
    width: t.number,
}

Confetti.defaultProps = {
    cannonFireCount: 5,
    colors: [
        themeColors.brick,
        themeColors.coral,
        themeColors.blue,
        themeColors.yellow,
    ],
    continuous: true,
    decay: 10, // sec
    fireIntervalInSeconds: 4,
    gravity: 0.1,
    height: 800,
    onClick: undefined,
    spread: 60,
    width: 800,
}

export default Confetti



// WEBPACK FOOTER //
// ./app/components/Effects/Confetti/index.jsx