import React from 'react'
import css from './GovernancePage.css'

export default class RulesPage extends React.Component {

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
                      <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>Add Rule
                    </button>
                  </div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">
                            Password Strength
                          </div>
                        </div>
                      </div>
                      <div className="box-body">
                        <dl className="dl-horizontal wings-dl __dl">
                          <dt>Password Strength must be</dt>
                          <dd>
                            <select>
                              <option>greater than</option>
                              <option>less than</option>
                            </select>
                            <select>
                              <option>Medium</option>
                              <option>High</option>
                              <option>Low</option>
                            </select>
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
                            Artifact Status
                          </div>
                        </div>
                      </div>
                      <div className="box-body">
                        <dl className="dl-horizontal wings-dl __dl">
                          <dt>Status must be</dt>
                          <dd>
                            <select>
                              <option>equal</option>
                            </select>
                            <select>
                              <option>Approved</option>
                            </select>
                          </dd>
                          <dt>Filter</dt>
                          <dd>(Application: *, Environment Type: Production)</dd>
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
// ../src/containers/GovernancePage/RulesPage.js