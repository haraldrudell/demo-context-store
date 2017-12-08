import React from 'react'
import css from './InfrastructurePage.css'

export default class Frameworks extends React.Component {
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
                      <div className="wings-add-new-icon">
                        <i className="icons8-plus-filled" />
                      </div>Add Execution Framework
                    </button>
                  </div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">SSH</div>
                        </div>
                      </div>
                      <div className="box-body">Secure Shell</div>
                    </div>
                  </div>

                  <div>&nbsp;</div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">Power Shell</div>
                        </div>
                      </div>
                      <div className="box-body">Microsoft Power Shell</div>
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
// ../src/containers/InfrastructurePage/Frameworks.js