import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import randomRange from 'utilities/random-range'
import requestAnimationFrame from 'utilities/request-animation-frame'

class ParticleScene extends Component {
    static propTypes = {
        colors: t.array,
        directionalSpeedX: t.number,
        directionalSpeedY: t.number,
        particleDensity: t.number,
        particleHeight: t.number,
        particleWidth: t.number,
        spinRate: t.number,
        viewportHeight: t.number,
        viewportWidth: t.number,
    }

    static defaultProps = {
        colors: ['red'],
        directionalSpeedX: 2,
        directionalSpeedY: 0.1,
        gridSpawnResolution: 6,
        particleDensity: 0.75,
        particleHeight: 100,
        particleWidth: 20,
        spinRate: 0.5,
        viewportHeight: 200,
        viewportWidth: 500,
    }

    colorIndex = 0

    constructor(props) {
        super(props)
        this.particles = []
    }

    componentDidMount() {
        this.startRenderLoop()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.viewportWidth !== this.props.viewportWidth) {
            return true
        }
        return false
    }

    startRenderLoop() {
        const frameExec = tFrame => {
            const now = new Date().getTime()
            this.loop(tFrame, now)
            requestAnimationFrame(frameExec)
        }
        frameExec()
    }

    getColorIndex = () => {
        const { colors } = this.props
        const index = this.colorIndex
        let nextIndex
        if (index >= colors.length - 1) {
            nextIndex = 0
        } else {
            nextIndex = index + 1
        }
        this.colorIndex = nextIndex
        return index
    }

    loop = () => {
        const {
            colors,
            viewportWidth,
            viewportHeight,
            particleWidth,
            particleHeight,
        } = this.props
        this.particles.map(p => {
            if (!p.el) {
                return
            }

            const maxParticleSize = Math.max(p.height, p.width)
            if (p.x > viewportWidth + maxParticleSize) {
                p.x = -maxParticleSize
                p.y = randomRange(-maxParticleSize / 2, viewportHeight)
                p.color = colors[this.getColorIndex()]
                p.el.setAttribute('fill', p.color)
            } else {
                p.x += p.directionalSpeedX
            }

            if (p.y > viewportHeight + maxParticleSize) {
                p.y = -maxParticleSize
            }

            if (p.y < 0 - maxParticleSize) {
                p.y = viewportHeight + maxParticleSize
            }

            p.y += p.directionalSpeedY
            p.r += p.spin ? p.spinRate : -p.spinRate

            p.el.setAttribute(
                'transform',
                `translate(${p.x} ${p.y}) rotate(${p.r} ${particleWidth /
                    2} ${particleHeight / 2})`,
            )
            p.el.setAttribute('width', particleWidth)
            p.el.setAttribute('height', particleHeight)
        })
    }

    particleRadius = () => {
        const { particleHeight, particleWidth } = this.props
        return (
            Math.sqrt(
                Math.pow(particleHeight, 2) + Math.pow(particleWidth, 2),
            ) / 2.0
        )
    }

    particleDensity = () => {
        const {
            particleDensity,
            particleWidth,
            particleHeight,
            viewportWidth,
            viewportHeight,
        } = this.props
        const particleArea = particleWidth * particleHeight * 4.0
        const area = viewportWidth * viewportHeight / 2.0
        return Math.round(area / particleArea * particleDensity)
    }

    initParticle = (ref, i) => {
        const {
            colors,
            particleHeight,
            particleWidth,
            directionalSpeedX,
            directionalSpeedY,
            spinRate,
            viewportWidth,
            viewportHeight,
        } = this.props

        if (this.particles[i]) {
            return
        }

        const maxParticleSize = Math.max(particleHeight, particleWidth)
        const newParticle = {
            x: randomRange(-maxParticleSize, viewportWidth),
            y: randomRange(-maxParticleSize / 2, viewportHeight),
            r: randomRange(0, 360),
            directionalSpeedX: randomRange(
                directionalSpeedX - 0.5,
                directionalSpeedX,
            ),
            directionalSpeedY: randomRange(
                -directionalSpeedY / 2,
                directionalSpeedY / 2,
            ),
            spin: randomRange(0, 1),
            spinRate: randomRange(spinRate * 0.9, spinRate * 1.1),
            color: colors[this.getColorIndex()],
            el: ref,
            width: particleWidth,
            height: particleHeight,
        }
        if (ref) {
            ref.setAttribute('fill', newParticle.color)
        }
        this.particles.push(newParticle)
    }

    renderParticles() {
        const particleCount = this.particleDensity()
        if (this.particles.length > particleCount) {
            this.particles = this.particles.slice(0, particleCount + 1)
        }
        return Array(particleCount)
            .fill()
            .map((_, i) =>
                <rect
                    ref={ref => this.initParticle(ref, i)}
                    key={`particleRect-${i.toString()}`}
                    className={`particle-${i}`}
                />,
            )
    }

    render() {
        const { viewportWidth, viewportHeight } = this.props
        return (
            <StyledSvg
                preserveAspectRatio="none"
                viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
            >
                {this.renderParticles()}
            </StyledSvg>
        )
    }
}

const StyledSvg = styled.svg`
    background-color: ${props => props.theme.colors.gray1};
    position: absolute;
`

export default ParticleScene



// WEBPACK FOOTER //
// ./app/components/Effects/ParticleScene/index.jsx