import jwt_decode from 'jwt-decode';
const user = jwt_decode(JSON.parse(localStorage.getItem('acces')));
const salarie = jwt_decode(JSON.parse(localStorage.getItem('token')));
function buildNav(acces) {
  const navBar = [];
  let children = [];
  let objItem = {};
  let objChildren = {};
  navBar.push({
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: "cil-speedometer",
  })
  acces.map(ac => {
    
    if (ac.frontRoute !== "/") {
      if (!ac.hidden) {
        if (ac.parent === null) {
          children = [];
          if (acces.filter(  ac2 => ac2.parent && !ac2.hidden && ac2.parent.id === ac.id).length < 1) {
            objItem = {
              _tag: 'CSidebarNavItem',
              name: ac.description,
              to: ac.frontRoute.includes('https://') ? '' : ac.frontRoute.includes(":idSalarie") ? ac.frontRoute.replace(':idSalarie', salarie.id) : ac.frontRoute,
              href: ac.frontRoute.includes('https://') ? ac.frontRoute : '',
              target: ac.frontRoute.includes('https://') ? '_blank' : '',
              icon: ac.icon,
            };
          } else {
            children = [];
            objItem = {
              _tag: 'CSidebarNavDropdown',
              name: ac.description,
              to: ac.frontRoute.includes('https://') ? '' : ac.frontRoute.includes(":idSalarie") ? ac.frontRoute.replace(':idSalarie', salarie.id) : ac.frontRoute,
              href: ac.frontRoute.includes('https://') ? ac.frontRoute : '',
              target: ac.frontRoute.includes('https://') ? '_blank' : '',
              icon: ac.icon,
              _children: []
            }
            acces.map(da => {
              if (da.parent !== null) {
                if ((da.parent.id === ac.id && !da.hidden) ) {
                  objChildren = {
                    _tag: 'CSidebarNavItem',
                    name: da.description,
                    to: da.frontRoute.includes('https://') ? '' : da.frontRoute.includes(":idSalarie") ? da.frontRoute.replace(':idSalarie', salarie.id) : da.frontRoute,
                    href: da.frontRoute.includes('https://') ? da.frontRoute : '',
                    target: da.frontRoute.includes('https://') ? '_blank' : '',
                  };
                  return children.push(objChildren);
                }
              }
              else {

              }
              return null;
            });
            objItem._children = children;
          }

          navBar.push(objItem);
        }
      }
    }
    return null;
  })


  return navBar;
}




export const nav = buildNav(user.acces);
