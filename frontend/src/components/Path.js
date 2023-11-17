//const app_name = 'progress-tracker-4331-88c53c23c126'
const app_name = 'Dare2Do'
exports.buildPath =
function buildPath(route)
{
if (process.env.NODE_ENV === 'production')
{
//return 'https://' + app_name + '.herokuapp.com/' + route;
return 'https://' + app_name + '.online/' + route;
}
else
{
return 'http://localhost:5000/' + route;
}
}
