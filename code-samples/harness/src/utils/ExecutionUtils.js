import { ExecutionStatus } from './Constants'

/**
 * Execution Status Style Mapping.
 * Note: The order of this array is important for rendering breakdown chart.
 */
export const ExecutionStatusStyleMapping = [
  {
    status: ExecutionStatus.SUCCESS,
    color: 'var(--color-green-light)',
    icon: '/img/deployments/icon-deployments-success.svg'
  },
  {
    status: ExecutionStatus.FAILED,
    color: 'var(--color-red-light)',
    icon: '/img/deployments/icon-deployments-failed.svg'
  },
  {
    status: ExecutionStatus.ERROR,
    color: 'var(--color-red-light)',
    icon: '/img/deployments/icon-deployments-error.svg'
  },
  {
    status: ExecutionStatus.ABORTED,
    color: 'var(--color-grey)',
    icon: '/img/deployments/icon-deployments-aborted.svg'
  },
  {
    status: ExecutionStatus.ABORTING,
    color: 'var(--color-grey-50)',
    icon: '/img/deployments/icon-deployments-running.svg'
  },
  {
    status: ExecutionStatus.WAITING,
    color: 'var(--color-yellow-light)',
    icon: '/img/deployments/icon-deployments-paused.svg'
  },
  {
    status: ExecutionStatus.PAUSED,
    color: 'var(--color-yellow-light)',
    icon: '/img/deployments/icon-deployments-paused.svg'
  },
  {
    status: ExecutionStatus.PAUSING,
    color: 'var(--color-yellow-light)',
    icon: '/img/deployments/icon-deployments-running.svg'
  },
  {
    status: ExecutionStatus.RUNNING,
    color: 'var(--color-blue-light)',
    icon: '/img/deployments/icon-deployments-running.svg'
  },
  {
    status: ExecutionStatus.QUEUED,
    color: 'var(--color-grey-50)',
    icon: '/img/deployments/icon-deployments-queued.svg'
  }
]

export function styleForStatus (status) {
  status = (status || '').toUpperCase()

  return ExecutionStatusStyleMapping.find(entry => entry.status === status)
}


// WEBPACK FOOTER //
// ../src/utils/ExecutionUtils.js