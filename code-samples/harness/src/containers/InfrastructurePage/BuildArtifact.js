import React from 'react'
import css from './InfrastructurePage.css'

export default class BuildArtifact extends React.Component {

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
                      <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>Add Build Server
                    </button>
                  </div>

                  <div className="col-md-12 __card">
                    <div className="box-solid wings-card">
                      <div className="box-header">
                        <div className="wings-card-header">
                          <div className="wings-text-link">
                            Jenkins - ec2-54-172-208-173.compute-1-amazonaws.com
                          </div>
                        </div>
                      </div>
                      <div className="box-body">
                        <dl className="dl-horizontal wings-dl __dl">
                          <dt>URL</dt>
                          <dd>http://ec2-54-172-208-173.compute-1-amazonaws.com</dd>
                          <dt>Authorization</dt>
                          <dd>Basic</dd>
                          <dt>Username</dt>
                          <dd>wingsbuild</dd>
                          <dt>Password</dt>
                          <dd>(not shown)</dd>
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
// ../src/containers/InfrastructurePage/BuildArtifact.js