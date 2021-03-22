const cleanUpBreadcrumbs = (arr, extraPath) => {
  //Remove unnecessary paths
  let stripArr = arr.slice(2, arr.length)

  //Extra path
  if (extraPath)
    stripArr.push({ name: extraPath, url: null })

  let isDashboard = false;
  const DashboardElement = {name: 'DASHBOARD', url: '/admin/dashboard'}
  // Check if it contains a path that has Dashboard at the beginning
  // To avoid getting the jwt token in the breadcrumb
  stripArr.forEach((element,i) => {
    if (element.name.startsWith('DASHBOARD')){
      stripArr[i] = DashboardElement
      isDashboard = true
    }
  })

  if(!isDashboard) return [DashboardElement, ...stripArr]

  return stripArr
}

module.exports = {
  cleanUpBreadcrumbs
}
