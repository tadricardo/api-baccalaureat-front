import React from 'react';
import PropTypes from 'prop-types';
import { CWidgetBrand, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';

const WidgetsBrand = ({withCharts})=>{

  // render

  return withCharts ?
  <CRow>
    <CCol sm="6" lg="3">
      <CWidgetBrand
        color="facebook"
        rightHeader="89k"
        rightFooter="Salaries"
        leftHeader="459"
        leftFooter="Postes"
      >
        <CIcon
          name="cil-user"
          height="52"
          className="my-4"
        />

      </CWidgetBrand>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetBrand
        color="twitter"
        rightHeader="973k"
        rightFooter="followers"
        leftHeader="1.792"
        leftFooter="tweets"
      >
        <CIcon
          name="cib-twitter"
          height="52"
          className="my-4"
        />

      </CWidgetBrand>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetBrand
        color="linkedin"
        rightHeader="500+"
        rightFooter="contracts"
        leftHeader="292"
        leftFooter="feeds"
      >
        <CIcon
          name="cib-linkedin"
          height="52"
          className="my-4"
        />

      </CWidgetBrand>
    </CCol> 

    <CCol sm="6" lg="3">
      <CWidgetBrand
        rightHeader="12"
        rightFooter="events"
        leftHeader="4"
        leftFooter="meetings"
        color="gradient-warning"
      >
        <CIcon
          name="cil-calendar"
          height="52"
          className="my-4"
        />
      </CWidgetBrand>
    </CCol>
  </CRow> :
  
  <CRow>
    <CCol sm="6" lg="3">
      <CWidgetBrand
        color="facebook"
        rightHeader="89k"
        rightFooter="Salaries"
        leftHeader="459"
        leftFooter="Postes"
      >
        <CIcon
          name="cib-facebook"
          height="56"
          className="my-4"
        />
      </CWidgetBrand>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetBrand
        color="twitter"
        rightHeader="973k"
        rightFooter="followers"
        leftHeader="1.792"
        leftFooter="tweets"
      >
        <CIcon
          name="cib-twitter"
          height="56"
          className="my-4"
        />
      </CWidgetBrand>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetBrand
        color="linkedin"
        rightHeader="500+"
        rightFooter="contracts"
        leftHeader="292"
        leftFooter="feeds"
      >
        <CIcon
          name="cib-linkedin"
          height="56"
          className="my-4"
        />
      </CWidgetBrand>
    </CCol>

    <CCol sm="6" lg="3">
      <CWidgetBrand
        rightHeader="12"
        rightFooter="events"
        leftHeader="4"
        leftFooter="meetings"
        color="gradient-warning"
      >
        <CIcon
          name="cil-calendar"
          height="56"
          className="my-4"
        />
      </CWidgetBrand>
    </CCol>
  </CRow>
}

WidgetsBrand.propTypes = {
  withCharts: PropTypes.bool
}

export default WidgetsBrand
