/* eslint-disable max-len */
import React from 'react'
import { ExecutionStatus } from '../../utils/Constants'

const { FAILED, SUCCESS, ABORTED, ERROR, PAUSED, PAUSING, WAITING, ABORTING, RUNNING, QUEUED } = ExecutionStatus

const renderHtml = (__html, className, props) => {
  return <div {...props} dangerouslySetInnerHTML={{ __html }} className={className} />
}

const Execute = props => {
  const __html =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'x="0px" y="0px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"> ' +
    '  <circle fill="#00ade4" cx="24" cy="24" r="20"></circle> ' +
    '  <polygon fill="#FFFFFF" points="17,33 17,15 35,24 "></polygon> ' +
    '</svg>'
  return <div className={props.className} dangerouslySetInnerHTML={{ __html }} />
}

const Artifact = props => {
  const __html = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"><style type="text/css">
	.st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
	.st1{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
</style><path d="M18.8,48.2l8.4,5.8c1.1,0.8,1.5,2.3,0.8,3.6l-5.1,8.9c-1,1.7-0.8,3.7,0.4,5.3c1.2,1.5,3.2,2.1,5,1.6l9.8-3  c1.3-0.4,2.8,0.3,3.3,1.6l3.8,9.5c0.7,1.8,2.4,3,4.4,3s3.6-1.1,4.4-3l3.8-9.5c0.5-1.3,2-2,3.3-1.6l9.8,3c1.9,0.6,3.8,0,5-1.6  c1.2-1.5,1.4-3.5,0.4-5.3l-5.1-8.9c-0.7-1.2-0.3-2.8,0.8-3.6l8.4-5.8c1.6-1.1,2.4-3,1.9-4.9c-0.4-1.9-1.9-3.3-3.9-3.6l-10.1-1.5  c-1.4-0.2-2.4-1.5-2.3-2.8l0.7-10.2c0.1-2-0.9-3.7-2.6-4.6c-1.8-0.9-3.8-0.6-5.2,0.8l-7.5,6.9c-1,0.9-2.6,0.9-3.6,0l-7.5-6.9  c-1.4-1.3-3.4-1.6-5.2-0.8c-1.8,0.9-2.8,2.6-2.6,4.6l0.7,10.2c0.1,1.4-0.9,2.6-2.3,2.8l-10.1,1.5c-1.9,0.3-3.4,1.7-3.9,3.6  C16.4,45.2,17.1,47.1,18.8,48.2z M18.8,43.7c0.2-0.9,0.9-1.9,2.2-2.1l10.1-1.5c2.4-0.4,4.1-2.5,4-5l-0.7-10.2  c-0.1-1.3,0.7-2.2,1.5-2.6c0.8-0.4,2-0.5,3,0.4l7.5,6.9c1.8,1.6,4.6,1.6,6.4,0l7.5-6.9c1-0.9,2.2-0.8,3-0.4c0.8,0.4,1.6,1.3,1.5,2.6  L64,35.2c-0.2,2.4,1.6,4.6,4,5l10.1,1.5c1.3,0.2,2,1.2,2.2,2.1s0,2.1-1.1,2.8l-8.4,5.8c-2,1.4-2.6,4.1-1.4,6.2l5.1,8.9  c0.7,1.2,0.3,2.3-0.2,3c-0.6,0.7-1.6,1.3-2.9,0.9l-9.8-3c-2.3-0.7-4.8,0.5-5.7,2.8L52,80.6c-0.5,1.3-1.6,1.7-2.5,1.7s-2-0.4-2.5-1.7  l-3.8-9.5c-0.7-1.8-2.5-3-4.4-3c-0.5,0-0.9,0.1-1.4,0.2l-9.8,3c-1.3,0.4-2.3-0.2-2.9-0.9c-0.5-0.7-0.9-1.8-0.2-3l5.1-8.9  c1.2-2.1,0.6-4.8-1.4-6.2l-8.4-5.8C18.8,45.8,18.6,44.6,18.8,43.7z"/></svg>`
  return <div className={props.className} dangerouslySetInnerHTML={{ __html }} />
}

const HarnessLogo = props => {
  const __html = `<svg version="1.1" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  style="enable-background:new 0 0 141 30;" xml:space="preserve">
<style type="text/css">
 .st0{fill:#00A3E0;}
 .st1{fill:#FFFFFF;}
</style>
<g>
 <path class="st0" d="M28.4,9.8l-7.5-7.5c-0.1-0.1-1.3-1.3-3.1-1.9c-2.6-0.9-5.1-0.2-7.2,1.9L3,9.8c-0.1,0.1-1.3,1.3-1.9,3.1
   c-0.9,2.6-0.2,5.1,1.9,7.2l7.5,7.5c0.1,0.1,1.3,1.3,3.1,1.9c0.7,0.2,1.5,0.4,2.2,0.4c1.8,0,3.5-0.8,5-2.2l7.5-7.5
   c0.1-0.1,1.3-1.3,1.9-3.1C31.1,14.5,30.4,11.9,28.4,9.8 M16.3,4.5c0.8,0.3,1.5,0.8,1.5,0.9L20,7.6l-4.3,4.3l-4.3-4.3l2.2-2.2
   C14.2,4.8,15,4.1,16.3,4.5 M5.2,14.4c0.3-0.8,0.8-1.5,0.9-1.5l2.2-2.2l4.3,4.3l-4.3,4.3L6,17.1C5.4,16.5,4.8,15.6,5.2,14.4
    M15.1,25.5c-0.8-0.3-1.5-0.8-1.5-0.9l-2.2-2.2l4.3-4.3l4.3,4.3l-2.2,2.2C17.2,25.2,16.3,25.8,15.1,25.5 M26.2,15.6
   c-0.3,0.8-0.8,1.5-0.9,1.5l-2.2,2.2L18.7,15l4.3-4.3l2.2,2.2C25.9,13.5,26.5,14.3,26.2,15.6"/>
 <path class="st1" d="M44.6,25.6h3.9V14.8c0-3.3-2-5.8-5.5-5.8c-1.7,0-3.5,0.7-4.4,2.1v-8h-3.9v22.4h3.9v-8.5c0-2,1-4.5,3.3-4.5
   c2.1,0,2.7,1.2,2.7,3V25.6z M60.3,19.2c0,2.4-1.7,3.7-4.1,3.7c-1.2,0-2.3-0.8-2.3-2c0-1.3,1.1-2,2.3-2.1l4.1-0.3V19.2z M63.5,25.8
   c0.9,0,1.3-0.2,1.9-0.4v-2.8c0,0-0.2,0.1-0.5,0.1c-0.6,0-0.9-0.3-0.9-1v-6c0-1.1-0.1-2.2-0.5-3.2c-0.9-2.4-3.3-3.3-6-3.3
   c-3.6,0-6.4,1.6-6.7,5.2h3.7c0.1-1.5,1.1-2.3,2.9-2.3c2.2,0,2.7,1,2.7,2.5v1l-4.7,0.3c-3.1,0.2-5.4,2-5.4,5c0,2.6,2,5,5.8,5
   c2.3,0,4.1-1.1,4.9-2.4C60.9,24.8,61.9,25.8,63.5,25.8 M75.6,13c0.2,0,0.4,0,0.6,0V9.4c-0.2,0-0.3,0-0.5,0c-1.9,0-3.8,0.8-4.5,2.6
   l-0.3-2.4h-3.3v16h3.9v-8.1C71.5,14.9,72.9,13,75.6,13 M87.8,25.6h3.9V14.9c0-3.3-2-5.7-5.4-5.7c-1.9,0-3.8,0.8-4.7,2.5l-0.3-2.1
   H78v16h3.9v-6.5c0-1.4,0-3,0.5-4.3c0.5-1.2,1.4-2,2.8-2c2,0,2.7,1.1,2.7,3V25.6z M104.3,16h-6.9c0-1,0.3-1.8,0.8-2.5
   c0.6-0.7,1.5-1.2,2.7-1.2c1.1,0,1.9,0.4,2.4,0.9C103.9,13.8,104.3,14.8,104.3,16 M108.2,17.7c0.1-2-0.2-3.8-1.4-5.6
   c-1.3-2-3.5-3-5.9-3c-2.2,0-3.9,0.8-5.1,2c-1.5,1.6-2.3,3.9-2.3,6.4c0,2.6,0.9,4.9,2.5,6.4c1.3,1.2,2.9,2,5.1,2c2,0,4-0.6,5.4-2.3
   c0.6-0.7,1.3-2,1.4-3h-3.7c-0.2,0.6-0.4,1-0.8,1.4c-0.6,0.6-1.2,0.8-2.3,0.8c-1,0-1.8-0.5-2.4-1c-0.8-0.7-1.2-1.9-1.2-3.1h10.7
   C108.1,18.4,108.2,17.7,108.2,17.7 M113.3,14c0-0.8,0.6-1.4,1.2-1.7c0.6-0.2,1.1-0.2,1.7-0.2c0.8,0,1.6,0.3,2.1,0.7
   c0.4,0.4,0.6,0.9,0.6,1.5h3.7c0-1.2-0.6-2.4-1.4-3.3c-1.2-1.3-3.1-1.9-5-1.9c-2,0-3.7,0.6-4.9,1.6c-1,0.8-1.6,2-1.6,3.6
   c0,2,1.5,3.8,3.7,4.3c1.4,0.3,3,0.4,4.4,0.6c1,0.2,1.6,0.8,1.6,1.7c0,1.8-2,2-3.3,2c-1.1,0-1.8-0.2-2.4-0.7
   c-0.4-0.3-0.7-0.9-0.8-1.5h-3.6c0.1,1.3,0.8,2.5,1.7,3.3c1.3,1.3,3.1,1.9,5.2,1.9c2.2,0,4.2-0.6,5.5-1.9c0.8-0.8,1.4-2,1.4-3.5
   c0-2.5-1.8-4.1-4.4-4.5c-1.6-0.2-2-0.3-3.4-0.5C114.3,15.5,113.3,15.2,113.3,14 M133.8,14.3h3.7c0-1.2-0.6-2.4-1.4-3.3
   c-1.2-1.3-3.1-1.9-5-1.9c-2,0-3.7,0.6-4.9,1.6c-1,0.8-1.6,2-1.6,3.6c0,2,1.5,3.8,3.7,4.3c1.4,0.3,3,0.4,4.4,0.6
   c1,0.2,1.6,0.8,1.6,1.7c0,1.8-2,2-3.3,2c-1.1,0-1.8-0.2-2.4-0.7c-0.4-0.3-0.7-0.9-0.8-1.5h-3.6c0.1,1.3,0.8,2.5,1.7,3.3
   c1.3,1.3,3.1,1.9,5.2,1.9c2.2,0,4.2-0.6,5.5-1.9c0.8-0.8,1.4-2,1.4-3.5c0-2.5-1.8-4.1-4.4-4.5c-1.6-0.2-2-0.3-3.4-0.5
   c-0.9-0.1-1.9-0.5-1.9-1.6c0-0.8,0.6-1.4,1.2-1.7c0.6-0.2,1.1-0.2,1.7-0.2c0.8,0,1.6,0.3,2.1,0.7C133.5,13.2,133.8,13.7,133.8,14.3
   "/>
</g>
</svg>`
  return <div {...props} className={props.className} dangerouslySetInnerHTML={{ __html }} />
}

const renderStatusIcon = (status, className, toolTip = { showToolTip: false }) => {
  if (status === PAUSED || status === PAUSING || status === WAITING) {
    return renderPausedIcon(className, toolTip)
  } else if (status === FAILED || status === ERROR) {
    return renderFailedIcon(className, toolTip)
  } else if (status === SUCCESS) {
    return renderSuccessIcon(className, toolTip)
  } else if (status === ABORTED || status === ABORTING) {
    return renderAbortedIcon(className, toolTip)
  } else if (status === RUNNING) {
    return renderRunningIcon(className, toolTip)
  } else if (status === QUEUED) {
    return renderQueuedIcon(className, toolTip)
  }
}

const renderTemplatizeIcon = (className, clickHandler) => {
  const __html = `<svg version="1.1" id="Layer_4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	      viewBox="0 0 612 792" style="enable-background:new 0 0 612 792;"
        xml:space="preserve">
        <style type="text/css">
	          .st0{fill:#FFFFFF;}
	          .st1{fill:#020404;}
        </style>
        <g>
          <title>Templatize</title>
	        <g>
		          <path class="st0" d="M611,655.7H1c-0.5,0-1-0.5-1-1L0,1c0-0.6,0.5-1,1-1h610c0.5,0,1,0.4,1,1v653.7
			C612,655.3,611.5,655.7,611,655.7z"/>
		        <path d="M568.3,43.7V612H43.7V43.7H568.3 M568.3,0H43.7C19.7,0,0,19.7,0,43.7V612c0,24,19.7,43.7,43.7,43.7h524.6
			c24,0,43.7-19.7,43.7-43.7V43.7C612,19.7,592.3,0,568.3,0L568.3,0z"/>
	        </g>
	    <g>
		      <rect x="131.5" y="130" class="st1" width="349" height="87.4"/>
			    <rect x="131.1" y="307.5" transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 656.8969 45.5795)" class="st1" width="349" height="87.4"/>
	    </g>
    </g>
    </svg>`
  return renderHtml(__html, className)
}

const renderNonTemplatizeIcon = className => {
  const __html = `<svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 792">
      <defs>
        <style>
          .cls-1{fill:#fff;}.cls-2{fill:#020404;}
        </style>
     </defs>
  <g>
    <title>Non-Templatize</title>
    <rect class="cls-1" width="612" height="655.71" rx="1" ry="1"/>
    <path d="M568.29,43.71V612H43.71V43.71H568.29m0-43.71H43.71A43.84,43.84,0,0,0,0,43.71V612a43.84,43.84,0,0,0,43.71,43.71H568.29A43.84,43.84,0,0,0,612,612V43.71A43.84,43.84,0,0,0,568.29,0Z"/>
    <rect class="cls-2" x="131.49" y="129.96" width="349.03" height="87.38"/>
    <rect class="cls-2" x="131.14" y="307.55" width="349.03" height="87.38" transform="translate(656.9 45.58) rotate(90)"/>
    <rect class="cls-2" x="279.28" y="-74.23" width="52.9" height="802.32" transform="translate(303.57 -120.67) rotate(42.8)"/>
  </g>
</svg>`
  return renderHtml(__html, className)
}

const renderQueuedIcon = className => <div className={className}><img src="/img/deployments/icon-deployments-queued.svg" title="Status: Queued"/></div>
const renderPausedIcon = className => <div className={className}><img src="/img/deployments/icon-deployments-paused.svg" title="Status: Paused"/></div>
const renderFailedIcon = className => <div className={className}><img src="/img/deployments/icon-deployments-failed.svg" title="Status: Failed"/></div>
const renderSuccessIcon = className => <div className={className}><img src="/img/deployments/icon-deployments-success.svg" title="Status: Success"/></div>
const renderAbortedIcon = className => <div className={className}><img src="/img/deployments/icon-deployments-aborted.svg" title="Status: Aborted"/></div>
const renderRunningIcon = className => <div className={className}><img src="/img/deployments/icon-deployments-running.svg" title="Status: Running"/></div>

const RiskCircle = props => {
  const radius = props.radius || 1
  const __html = `<svg version="1.1" id="QUE_1_copy_1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
	 y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
<g id="riskCircle">
	<g>
		<circle class="riskCircleStyle" cx="8" cy="8" r="${radius}">
       Test
    </circle>
	</g>
</g>
</svg>`
  return renderHtml(__html, props.className, props)
}

const TickMark = props => {
  const __html = ` <?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 20.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Rectangle_770_1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
	 y="0px" viewBox="0 0 16 12" style="enable-background:new 0 0 16 12;" xml:space="preserve">
<style type="text/css">
	.tickicon0{fill-rule:evenodd;clip-rule:evenodd;fill:#4FA83E;}
</style>
<g id="Rectangle_770">
	<g>
		<polygon class="tickicon0" points="15.8,2.4 13.6,0 5.4,7.5 2.6,4.7 0.2,7.1 5.1,12 5.4,11.7 5.5,11.9 		"/>
	</g>
</g>
</svg>`
  return <div {...props} className={props.className} dangerouslySetInnerHTML={{ __html }} />
}

const DeprecateIcon = props => {
  const __html = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 20.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 13 17" style="enable-background:new 0 0 13 17;" xml:space="preserve">
<style type="text/css">
	.deprecate{fill:#B8B8B8;}
</style>
<g>
	<path class="deprecate" d="M0,11.8c1.7,0,3.4,0,5.2,0c0,0.6,0,1.3,0,1.9c1.9,0,3.7,0,5.6,0c0-3.5,0-7,0-10.5c-0.9,0-1.7,0-2.6,0
		c0.2,0.2,0.3,0.4,0.5,0.5C8.4,4,8.1,4.3,7.8,4.6C7.2,3.9,6.4,3.2,5.8,2.5c0.7-0.7,1.4-1.4,2.1-2.1c0.2,0.2,0.5,0.5,0.8,0.8
		C8.5,1.4,8.4,1.6,8.2,1.8c1.4,0,2.7,0,4,0c0,4.4,0,8.8,0,13.2c-2.3,0-4.6,0-6.9,0c0,0.7,0,1.3,0,1.9c-1.8,0-3.5,0-5.2,0
		C0,15.3,0,13.6,0,11.8z M3.9,15.7c0-0.9,0-1.7,0-2.6c-0.9,0-1.7,0-2.5,0c0,0.9,0,1.7,0,2.6C2.2,15.7,3,15.7,3.9,15.7z"/>
	<path class="deprecate" d="M0,5.9c1.7,0,3.4,0,5.2,0c0,1.7,0,3.4,0,5.2c-1.7,0-3.4,0-5.2,0C0,9.3,0,7.6,0,5.9z M3.9,7.2
		c-0.9,0-1.7,0-2.5,0c0,0.9,0,1.7,0,2.6c0.9,0,1.7,0,2.5,0C3.9,8.9,3.9,8.1,3.9,7.2z"/>
	<path class="deprecate" d="M5.2,5.2c-1.7,0-3.4,0-5.2,0C0,3.4,0,1.7,0,0c1.7,0,3.4,0,5.2,0C5.2,1.7,5.2,3.4,5.2,5.2z M3.9,3.9
		c0-0.9,0-1.7,0-2.6c-0.9,0-1.7,0-2.5,0c0,0.9,0,1.7,0,2.6C2.2,3.9,3,3.9,3.9,3.9z"/>
</g>
</svg>`
  return <div {...props} className={props.className} dangerouslySetInnerHTML={{ __html }} />
}
const WingsIcons = {
  Execute,
  Artifact,
  RiskCircle,
  renderStatusIcon,
  renderTemplatizeIcon,
  renderNonTemplatizeIcon,
  HarnessLogo,
  TickMark,
  DeprecateIcon
}

export default WingsIcons



// WEBPACK FOOTER //
// ../src/components/WingsIcons/WingsIcons.js