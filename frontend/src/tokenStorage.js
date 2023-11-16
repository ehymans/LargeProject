exports.storeToken = function (tok) {
    try {
        if (tok.accessToken === null) {
            // Remove the token if accessToken is null (indicating logout)
            localStorage.removeItem('token_data');
        } else {
            // Store the token normally
            localStorage.setItem('token_data', tok.accessToken);
        }
    } catch (e) {
        console.log(e.message);
    }
}

exports.retrieveToken = function ()
{
    var ud;
    try
    {
        ud = localStorage.getItem('token_data');
    }
    catch(e)
    {
    console.log(e.message);
    }
    return ud;
}
