const app_name = 'progress-tracker-4331-88c53c23c126'
exports.buildPath =
function buildPath(route)
{
if (process.env.NODE_ENV === 'production')
{
return 'https://' + app_name + '.herokuapp.com/' + route;
}
else
{
return 'http://localhost:5000/' + route;
}
}
