import React from 'react'
import { Link } from 'react-router'
import Utils from '../Utils/Utils'
import AppStorage from '../AppStorage/AppStorage'
import css from './TaskNotificationTemplates.css'
import apis from 'apis/apis'

export default class TaskNotificationTemplates {
  /**
   * Returns formatted change template.
   * @param  {Object} notification - Notificaton object.
   */
  static change (notification) {
    return (
      <div className={'row ' + css.change}>
        <span className="col-md-1 col-xs-1">
          <i className="icons8-error-filled" />
        </span>
        <span className="col-md-10 col-xs-10">
          There's a &nbsp;
          <Link to={TaskNotificationTemplates.makeLink(notification)}>
            <span>change</span>
          </Link>
          &nbsp;scheduled for {Utils.formatDate(notification.scheduledOn)}
          {TaskNotificationTemplates.getDate(notification)}
        </span>
      </div>
    )
  }

  /**
   * Returns formatted approval template.
   * @param  {Object} notification - Notificaton object.
   * @param  {Function} fetchData - Fetch Data function of caller.
   */
  static approvalPending (notification, fetchData) {
    return (
      <div className={'row ' + css.approval}>
        <span className="col-md-1 col-xs-1">
          <i className="icons8-inspection" />
        </span>
        <span className="col-md-10 col-xs-10">
          {notification.entityType}&nbsp;
          <Link to={TaskNotificationTemplates.makeLink(notification)}>
            <span>
              {notification.entityName}
            </span>
          </Link>
          &nbsp;is waiting for approval
          {TaskNotificationTemplates.getDate(notification)}
          <div className={css.buttons}>
            {notification.notificationActions.map(action => {
              const className = action.primary ? 'btn-primary' : 'btn-default'
              return (
                <button
                  key={action.type}
                  className={'btn ' + className}
                  onClick={e => TaskNotificationTemplates.clickButton(notification, action.type, fetchData)}
                >
                  {action.name}
                </button>
              )
            })}
          </div>
        </span>
      </div>
    )
  }

  /**
   * Returns formatted approval template.
   * @param  {Object} notification - Notificaton object.
   */
  static approvalDone (notification) {
    return (
      <div className={'row ' + css.approval}>
        <span className="col-md-1 col-xs-1">
          <i className="icons8-inspection" />
        </span>
        <span className="col-md-10 col-xs-10">
          {notification.entityType}&nbsp;
          <Link to={TaskNotificationTemplates.makeLink(notification)}>
            <span>
              {notification.entityName}
            </span>
          </Link>
          &nbsp;is waiting for approval
          {TaskNotificationTemplates.getDate(notification)}
          <div className="light">
            <em>
              {' '}This has been {notification.stage.toLowerCase()}{' '}
            </em>
          </div>
        </span>
      </div>
    )
  }

  /**
   * Returns formatted failure template.
   * @param  {Object} notification - Notificaton object.
   */
  static failure (notification) {
    const url = TaskNotificationTemplates.makeLink(notification)
    return (
      <div className={'row ' + css.failure}>
        <span className="col-md-1 col-xs-1">
          <i className="icons8-inspection" />
        </span>
        <span className="col-md-10 col-xs-10">
          There are failures in workflow&nbsp;
          <Link to={url}>
            <span>
              {notification.entityName}
            </span>
          </Link>
          {TaskNotificationTemplates.getDate(notification)}
          <div className={css.buttons}>
            <button className="btn btn-primary" onClick={e => TaskNotificationTemplates.route(url)}>
              SEE DETAILS
            </button>
          </div>
        </span>
      </div>
    )
  }

  /**
   * Returns formatted info template.
   * @param  {Object} notification - Notificaton object.
   */
  static info (notification) {
    return (
      <div className={'row ' + css.info}>
        <span className="col-md-1 col-xs-1">
          <i className="icons8-inspection" />
        </span>
        <span className="col-md-10 col-xs-10">
          {notification.displayText}
          {TaskNotificationTemplates.getDate(notification)}
        </span>
      </div>
    )
  }

  /**
   * Returns formatted Date.
   * @param  {Object} notification - Notificaton object.
   */
  static getDate (notification) {
    return (
      <div className={css.date}>
        {Utils.formatDate(notification.createdAt)}
      </div>
    )
  }

  /**
   * Finds the appropriate template to pickup.
   * @param  {Object} notification - Notificaton object.
   * @param  {Function} fetchData - Fetch Data function of caller.
   */
  static get (notification, fetchData) {
    if (!notification || !notification.notificationType) {
      return
    }

    switch (notification.notificationType) {
      case 'CHANGE':
        return TaskNotificationTemplates.change(notification)
      case 'APPROVAL':
        if (notification.stage === 'PENDING') {
          return TaskNotificationTemplates.approvalPending(notification, fetchData)
        } else {
          return TaskNotificationTemplates.approvalDone(notification)
        }
      case 'FAILURE':
        return TaskNotificationTemplates.failure(notification)
      case 'INFO':
        return TaskNotificationTemplates.info(notification)
      default:
        return TaskNotificationTemplates.info(notification)
    }
  }

  // ---------* Utils *---------------- //

  /**
   * Returns location string.
   * @param  {Object} notification - Notificaton object.
   */
  static makeLink (notification) {
    let url = ''

    if (notification.appId) {
      url += `/app/${notification.appId}`
    }

    if (notification.entityType && notification.entityId) {
      const entity = notification.entityType.toLowerCase()
      if (entity === 'artifact') {
        url += '/artifacts'
      } else if (entity === 'release') {
        url += '/artifacts'
      } else if (entity === 'deployment') {
        url += `/pipeline/${notification.entityId}/editor`
      } else if (notification.environmentId) {
        url += `/env/${notification.environmentId}`
        url += `/${entity}/${notification.entityId}/detail`
      }
    }

    return url
  }

  /**
   * Handle Click Method.
   * @param  {Object} [notification] - Notification.
   * @param  {string} [action] - ACTION.
   * @param  {Function} fetchData - Fetch Data function of caller.
   */
  static clickButton (notification, action, fetchData) {
    const acctId = AppStorage.get('acctId')
    apis.service
      .create(apis.getNotificationEndpoint(notification.appId, acctId, notification.uuid, action))
      .then(r => {
        fetchData()
      })
      .catch(error => {
        fetchData()
        throw error
      })
  }

  /**
   * Handle Click Method.
   * @param  {string} [url] - URL to route.
   */
  static route (url) {
    window.location = '/#' + url
  }
}



// WEBPACK FOOTER //
// ../src/components/TaskNotification/TaskNotificationTemplates.js