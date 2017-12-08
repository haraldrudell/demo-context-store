import React from 'react'
import css from './GovernancePage.css'

export default class RolesPage extends React.Component {

  render () {

    return (
      <section className={css.main}>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="box-solid wings-card">

                <div className="box-body">

                  <div className="col-md-12">
                    <button className="btn btn-link wings-add-new">
                      <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>Add Role
                    </button>
                  </div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">
                            Account Admin
                          </div>
                        </div>
                      </div>
                      <div className="box-body">
                        <dl className="dl-horizontal wings-dl __dl">
                          <dt>Permissions</dt>
                          <dd>
                            (PermissionBits: *)
                          </dd>
                          <dt>Filter</dt>
                          <dd>
                            (Application: *, Environment Type: *)
                          </dd>
                          <dt>Users</dt>
                          <dd>
                            First Lastname, First Lastname, First Lastname, First Lastname, First Lastname, and 10 more
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div>
                    &nbsp;
                  </div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">
                            Production Operations
                          </div>
                        </div>
                      </div>
                      <div className="box-body">
                        <dl className="dl-horizontal wings-dl __dl">
                          <dt>Permissions</dt>
                          <dd>
                            (PermissionBits: DEPLOYMENT, ACTIVITY, INSTANCE)
                          </dd>
                          <dt>Filter</dt>
                          <dd>
                            (Application: *, Environment Type: PRODUCTION)
                          </dd>
                          <dt>Users</dt>
                          <dd>
                            First Lastname, First Lastname, First Lastname, First Lastname, First Lastname, and 10 more
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

      </section>
    )
  }

}



// WEBPACK FOOTER //
// ../src/containers/GovernancePage/RolesPage.js