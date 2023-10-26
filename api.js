const express = require('express');
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
      
      app.post('/api/register', async (req, res, next) => {
        // Incoming: first name, last name, username, password
        const { firstName, lastName, username, password } = req.body;
      
        try {
          const db = client.db('LargeProject');
      
          // Check if the username already exists
          console.log("I KNOW THE ISSUE");
          const existingUser = await db.collection('Users').findOne({ Login: username });
          console.log("NOT GONNA SEE ME");

          if (existingUser) {
            // Username is already taken
            res.status(400).json({ error: 'Username already taken' });
          } else {
            // Username is unique, insert the new user into the database
            const newUser = {
              FirstName: firstName,
              LastName: lastName,
              Login: username,
              Password: password,
            };
      
            // Insert the new user into the database
            await db.collection('Users').insertOne(newUser);
      
            res.status(200).json({ success: 'Registration successful' });
          }
        } catch (e) {
          // Handle any database or other errors
          res.status(500).json({ error: e.message });
        }
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
      
        try
        {
          const token = require("./createJWT.js");
          ret = token.createToken( fn, ln, id );
        }
        catch(e)
        {
          ret = {error:e.message};
        }
      }
      else
      {
        ret = {error:"Login/Password incorrect"};
      }
      
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