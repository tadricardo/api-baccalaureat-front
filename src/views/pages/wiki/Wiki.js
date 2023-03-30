import React, { useState } from 'react'
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardTitle,
    CCol,
    CCollapse,
    CContainer,
    CNav,
    CNavItem,
    CNavLink,
    CRow,
    CTabContent,
    CTabPane,
    CTabs
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faHammer, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { wikiData } from './Locale/fr';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { useEffect } from 'react';



const Wiki = (role) => {
    const [accordion, setAccordion] = useState(null);
    const [droit, setDroit] = useState(0);

    useEffect(() => {
        const fetchBusinesses = () => {
            switch (role.role) {
                case 1:
                    return 4;
                case 2:
                    return 3;
                case 3:
                    return 2;
                case 4:
                    return 1;
                default:
                    return 0;
            }
        };
        setDroit(fetchBusinesses());
    }, [droit, role]);

    return (

        <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol lg="12">
                        <CCard className="p-4">
                            <CCardTitle className="text-center"><FontAwesomeIcon icon={faInfoCircle} /> F.A.Q</CCardTitle>
                            <CCardBody>
                                <CTabs activeTab={wikiData[0].title}>
                                    <CNav variant="tabs">
                                        {
                                            wikiData.map((data, index) => (
                                                droit >= data.role &&
                                                
                                                <CNavItem key={index}>
                                                    <CNavLink data-tab={data.title}>
                                                        {data.title}
                                                    </CNavLink>
                                                </CNavItem>
                                                
                                            ))
                                        }
                                    </CNav>
                                    <CTabContent className="mt-3">
                                        {
                                            wikiData.map((data, index) => (
                                                <CTabPane key={index} data-tab={data.title}>
                                                    {!data.inProgress ? (
                                                        data?.faq.map((data, index) => (
 
                                                        <CRow key={index}>
                                                            <CCol>
                                                                <CCard>
                                                                    <CCardHeader className="d-flex justify-content-between">
                                                                        {data.issue}
                                                                        <CButton className="btn btn-light text-decoration-none" name={`btn${index}`} onClick={() => setAccordion(accordion === index ? null : index)}> <FontAwesomeIcon icon={faAngleDown} /> </CButton>
                                                                    </CCardHeader>
                                                                    <CCollapse id={`cardBody${index}`} show={accordion === index}>
                                                                        <CCardBody dangerouslySetInnerHTML={{ __html: data.reply }} >
                                                                        </CCardBody>
                                                                    </CCollapse>
                                                                </CCard>
                                                            </CCol>
                                                        </CRow>
                                                    ))) : <CAlert color="info" className="font-weight-bold"><FontAwesomeIcon icon={faHammer} spin/> En construction...</CAlert>}
                                                </CTabPane>
                                            ))
                                        }
                                    </CTabContent>
                                </CTabs>
                                <div className="text-right">
                                    <CButton className="mt-1 " to={"/"}  color="link" title="Vous voulez annuler ?">
                                        Retour en arrière
                                    </CButton>
                                </div>
                            </CCardBody>
                        </CCard>

                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}
const mapStateToProps = state => ({
    role: state.authen.isRole
});

export default withRouter(connect(mapStateToProps)(Wiki));;