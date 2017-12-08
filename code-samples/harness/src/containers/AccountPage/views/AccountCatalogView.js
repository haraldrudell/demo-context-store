import React from 'react'
import { Link } from 'react-router'

export default class AccountConnectorView extends React.Component {

  render () {
    return (
      <div data-name="Catalog" className="box-solid wings-card ">
        <div className="box-body __accountBody">
          <Link to={'/account/catalog'}>
            <div className="row">
              <div className="col-md-2 __accountIcon">
                <div>
                  <span className="wings-text-link">
                    <i className="icons8-view-details" />
                  </span>
                </div>
              </div>
              <div className="col-md-10 __accountContent" data-name="catalog-link">
                <div><h3>
                  <span className="wings-text-link">
                      Catalog
                  </span>
                </h3></div>
                <div>
                  <span className="light"> Application Catalog can be modeled here </span>
                </div>
                <div>
                  <span className="__normalText"> App Stacks, Shared Services, Shared Commands </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AccountPage/views/AccountCatalogView.js