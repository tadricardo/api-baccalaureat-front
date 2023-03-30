import { CCard, CCardBody, CCardHeader,  CNavItem, CNavLink, CTabContent , CTabPane, CRow, CCol, CTabs,CNav } from '@coreui/react';
import React from 'react';
import { withRouter } from 'react-router';

const Remuneration = () => {
    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <h3>Rémunération</h3>
                        </CCardHeader>
                        <CCardBody>
                            <CTabs>
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink>
                                            Grille / veille rémunération
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>
                                <CTabContent>
                                    {/* Grille / veille rémunération*/}
                                    <CTabPane>
                                        <CCardBody>

                                        </CCardBody>
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

export default withRouter(Remuneration);