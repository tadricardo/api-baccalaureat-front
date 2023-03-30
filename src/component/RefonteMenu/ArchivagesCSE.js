import { CCard, CCardBody,  CCardHeader,  CNav, CTabs ,CNavLink, CTabContent, CTabPane,CRow, CCol,CNavItem} from '@coreui/react';
import React from 'react';

const ArchivagesCSE = () => {
    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <h4>Archivages CSE</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CTabs>
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <CNavLink>
                                            Elections
                                        </CNavLink>
                                    </CNavItem>
                                
                                    <CNavItem>
                                        <CNavLink>
                                            Convocations
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>

                                <CTabContent>
                                    {/* Elections*/}
                                    <CTabPane>
                                        <CCardBody>

                                        </CCardBody>
                                    </CTabPane>
                                    {/*  Convocations*/}
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

export default ArchivagesCSE;