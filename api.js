require('express');
require('mongodb');

exports.setApp = function (app , client)
{
    app.post('/api/addcard', (req, res, next) => {
        // incoming: userId, card
        // outgoing: error
        
        const { userId, card, jwtToken } = req.body;
        try
          {
          if( token.isExpired(jwtToken))
            {
              var r = {error:'The JWT is no longer valid', jwtToken: ''};
              res.status(200).json(r);
              return;
            }
          }
        catch(e)
          {
            console.log(e.message);
            var r = {error:e.message, jwtToken: ''};
            res.status(200).json(r);
            return;
          }
        const newCard = {Card:card,UserId:userId};
        var error = '';
      
        try {
          const db = client.db('COP4331Cards');
          db.collection('Cards').insertOne(newCard);
        }
        catch(e) {
          error = e.toString();
        }
        var refreshedToken = null;
        try
          {
            refreshedToken = token.refresh(jwtToken);
          }
          catch(e)
          {
          console.log(e.message);
          }
        //cardList.push(card);
        
        var ret = { error: error };
        res.status(200).json(ret);
      });
      
    
    
    app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
        
     var error = '';
    
      const { login, password } = req.body;
    
      const db = client.db('LargeProject');
      const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
    
      var id = -1;
      var fn = '';
      var ln = '';
    
      if( results.length > 0 )
      {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
      }
      const token = require("./createJWT.js");
      ret = token.createToken( fn, ln, id );
      
      var ret = { id:id, firstName:fn, lastName:ln, error:''};
      res.status(200).json(ret);
    });
    
    
    app.post('/api/searchcards', async (req, res, next) => 
    {
      // incoming: userId, search
      // outgoing: results[], error
    
      var error = '';
    
      const { userId, search , jwtToken } = req.body;
    try
    {
    if( token.isExpired(jwtToken))
      {
        var r = {error:'The JWT is no longer valid', jwtToken: ''};
        res.status(200).json(r);
        return;
      }
    }
  catch(e)
    {
      console.log(e.message);
      var r = {error:e.message, jwtToken: ''};
      res.status(200).json(r);
      return;
    }
    var _search = search.trim();
    
    const db = client.db('COP4331Cards');
    const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'i'}}).toArray();
    
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
      _ret.push( results[i].Card );
    }
    var refreshedToken = null;
    try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        console.log(e.message);
      }   
      var ret = {results:_ret, error:error};
      res.status(200).json(ret);
    });
}