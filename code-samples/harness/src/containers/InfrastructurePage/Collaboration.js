import React from 'react'
import css from './InfrastructurePage.css'

export default class Collaboration extends React.Component {

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
                      <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>Add Collaboration
                    </button>
                  </div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">
                            SMTP - smtp.gmail.com
                          </div>
                        </div>
                      </div>
                      <div className="box-body">
                        <dl className="dl-horizontal wings-dl __dl">
                          <dt>Host</dt>
                          <dd>smtp.gmail.com</dd>
                          <dt>Port</dt>
                          <dd>465</dd>
                          <dt>Username</dt>
                          <dd>wings_test@wings.software</dd>
                          <dt>Password</dt>
                          <dd>(not shown)</dd>
                          <dt>Default from address</dt>
                          <dd>wings_test@wings.software</dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div>
                    &nbsp;
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
// ../src/containers/InfrastructurePage/Collaboration.js