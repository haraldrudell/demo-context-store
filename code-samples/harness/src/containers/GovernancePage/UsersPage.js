import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Wings } from 'utils'

import css from './GovernancePage.css'

const data = [
  {
    name: 'Robin Hood',
    email: 'userrob@wings.software',
    roles: 'Account Admin',
    lastLogin: '10 mins ago'
  },
  {
    name: 'Sam Urton',
    email: 'userurton@wings.software',
    roles: 'Product Operation',
    lastLogin: '2 days ago'
  },
  {
    name: 'Melvin Jackson',
    email: 'mjuser@wings.software',
    roles: 'Account Admin',
    lastLogin: '1 days ago'
  },
  {
    name: 'Hugh Jackman',
    email: 'userhj@wings.software',
    roles: 'Account Admin',
    lastLogin: '3 days ago'
  },
  {
    name: 'Jane Doe',
    email: 'jane@wings.software',
    roles: 'Product Operation',
    lastLogin: '6 months ago'
  },
  {
    name: 'William H',
    email: 'userrob@wings.software',
    roles: 'Account Admin',
    lastLogin: '3 days ago'
  },
  {
    name: 'Tilda Swinton',
    email: 'userrob@wings.software',
    roles: 'Account Admin',
    lastLogin: '27 days ago'
  },
  {
    name: 'Robin Hood',
    email: 'userrh@wings.software',
    roles: 'Account Admin',
    lastLogin: '10 days ago'
  },
  {
    name: 'Mary Visconti',
    email: 'usermv@wings.software',
    roles: 'Account Admin',
    lastLogin: '3 months ago'
  }
]

export default class UsersPage extends React.Component {

  componentWillMount () {
    this.columnDefs = [
      { headerName: 'Name', field: 'name', width: 100 },
      { headerName: 'Email', field: 'email', width: 180 },
      { headerName: 'Roles', field: 'roles', width: 180 },
      { headerName: 'Last Login', field: 'lastLogin', width: 180 }
    ]
  }

  onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi
    this.api.sizeColumnsToFit()
  }

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
                      <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>Add User
                    </button>
                  </div>

                  <div className="col-md-12 __card">
                    <div className="ag-fresh" style={{ height: 600 }}>
                      <AgGridReact
                        columnDefs={this.columnDefs}
                        rowData={data}
                        headerHeight={Wings.GRID_CELL_HEIGHT}
                        rowHeight={Wings.GRID_CELL_HEIGHT}
                        onGridReady={this.onGridReady}
                        doesDataFlower={(d) => true}
                        enableColResize="true"
                        enableSorting="true"
                        enableFilter="true"
                        groupHeaders="true"
                        debug="false"
                      ></AgGridReact>
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
// ../src/containers/GovernancePage/UsersPage.js