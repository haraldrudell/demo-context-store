import React from 'react'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import css from './ArtifactBuildLabel.css'

export class ArtifactBuildLabel extends React.Component {
  render () {
    const { artifactSourceName, buildNo } = this.props

    const popoverProps = {
      interactionKind: PopoverInteractionKind.HOVER,
      position: Position.TOP_LEFT,
      hoverCloseDelay: 100,
      hoverOpenDelay: 0,
      transitionDuration: 0,
      popoverClassName: 'artifact-label-popover'
    }

    return (
      <div className={`${css.main} `}>
        <Popover {...popoverProps}>
          {/* content to show */}
          <label-container>
            <static-text>build#</static-text>
            <span>{`${buildNo}`}</span>
          </label-container>

          <table-popover>
            <group>
              <table>
                <tr>
                  <td>
                    <key>Artifact Source:</key>
                  </td>
                  <td>
                    <value>{artifactSourceName}</value>
                  </td>
                </tr>

                <tr>
                  <td>
                    <key>Build No.:</key>
                  </td>
                  <td>
                    <value>{buildNo}</value>
                  </td>
                </tr>
              </table>
            </group>
          </table-popover>
        </Popover>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/ArtifactBuildLabel/ArtifactBuildLabel.js