import { CCard, CCardHeader, CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane, CTabs } from '@coreui/react';
import jwt_decode from 'jwt-decode';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import salariesService from 'src/services/salaries.service';
import EntretienDashboard from './entretienDashboard';
import EntretienPersonnelDashboard from './entretienPersonnelDashboard';
import FormationDashboard from './formationDashboard';
import FormationPersonnelDashboard from './formationPersonnelDashboard';

class DashBoard extends Component {

    constructor(props) {
        super(props);
        this.retrieveSalarie = this.retrieveSalarie.bind(this);
        this.state = {
            currentUser: jwt_decode(this.props.user),
            acces: jwt_decode(this.props.acces),
            role: this.props.isRole,
            user: {
                id: null,
                nom: null,
                prenom: null,
                role: [{
                    id: null,
                    titre: null,
                }],
            },
        }
    }
    componentDidMount() {
        const token = JSON.parse(localStorage.getItem("token"));
        const acces = JSON.parse(localStorage.getItem("acces")); 
        if (token !== null) {
          const user = jwt_decode(token);
          const route = jwt_decode(acces);
          this.setState({currentUser : user,acces: route})
          this.retrieveSalarie(this.state.currentUser.id);
        }
        
    }

    retrieveSalarie(id) {
        salariesService.getSalarieById(id)
            .then(response => {
                this.setState({
                    user: response.data,
                });
            })
            .catch(e => {
                console.log("erreur salarie : ", e.name);
            });
    }

    render() {
        const { user,role,currentUser } = this.state;
        return (
            <>
                <CRow>
                    <CCol xs="12" md="12" className="mb-4">
                        <CCard>
                            <CCardHeader>
                                <h4> Bonjour, {user.nom + " " + user.prenom}</h4>
                            </CCardHeader>
                            <div>
                                <CTabs>
                                    <CNav variant="tabs">
                                    {role <= 2  && 
                                        <CNavItem>
                                            <CNavLink>
                                                Informations global
                                            </CNavLink>
                                        </CNavItem>}
                                        <CNavItem>
                                            <CNavLink>
                                                Vos informations
                                            </CNavLink>
                                        </CNavItem>
                                    </CNav>
                                    <CTabContent>
                                        {role <= 2 &&
                                            <CTabPane>
                                                <FormationDashboard user={currentUser} userRole={currentUser.roles} />
                                                <EntretienDashboard user={currentUser} userRole={currentUser.roles} />
                                            </CTabPane>
                                        }
                                        <CTabPane>
                                            <FormationPersonnelDashboard idUser={currentUser.id} />
                                            <EntretienPersonnelDashboard idUser={currentUser.id} />
                                        </CTabPane>

                                    </CTabContent>
                                </CTabs>
                            </div>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        )

    }
}

function mapStateToProps(state) {
    const { isRole, user, acces } = state.authen;
    return {
      isRole,
      user,
      acces
    };
  }

export default connect(mapStateToProps)(DashBoard);