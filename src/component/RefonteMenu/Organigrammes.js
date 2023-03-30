import React from 'react';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CNav,
    CTabs,
    CTabPane,
    CNavItem,
    CNavLink,
    CTabContent
}
    from '@coreui/react';
import { withRouter } from 'react-router';


const Organigrammes = () => {
    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        
                        <CCardBody>
                            <CTabs>
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink>
                                            Organigramme centre
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                        Organigramme Métiers
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink>
                                        Organigramme Siége
                                        </CNavLink>
                                    </CNavItem>
                                   
                                </CNav>
                                <CTabContent>
                                    {/* Information generale */}
                                    <CTabPane>
                                        <CCard>
                                        
                                            <CCardBody>
                                                <p>centres</p>
                                            </CCardBody>

                                        </CCard>
                                    </CTabPane>


                                    <CTabPane>
                                        <CCard>
                                        
                                            <CCardBody>
                                                <p>Métiers</p>
                                            </CCardBody>

                                        </CCard>
                                    </CTabPane>


                                    <CTabPane>
                                        <CCard>
                                        
                                            <CCardBody>
                                                <p>siége</p>
                                            </CCardBody>

                                        </CCard>
                                    </CTabPane>
            
                                </CTabContent>
                            </CTabs>
                        </CCardBody>
                    </CCard>
                </CCol >
            </CRow >
        </>
    );
};

export default withRouter(Organigrammes);