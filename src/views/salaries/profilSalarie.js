import React, { Component } from 'react'
import Salarie from 'src/component/Salarie/Salarie';

class profilSalarie extends Component {

  render() {
    return(
      <>
        <Salarie salarieId={this.props.match.params} />
      </>
    )
  }
}

export default profilSalarie
