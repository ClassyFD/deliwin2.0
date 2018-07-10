module.exports = {
  submitFeedback: (req, res)=>{
    req.app.get('db').submitFeedback([req.body.name, req.body.email, req.body.feedback_text, req.body.date]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getMenu: (req, res)=>{
    req.app.get('db').getSandwiches().then((sandwiches)=>{
      req.app.get('db').getBread().then((bread)=>{
        req.app.get('db').getSides().then((sides)=>{
          req.app.get('db').getDrinks().then((drinks)=>{
            req.app.get('db').getSauces().then((sauces)=>{
              let menu = {
                sandwiches,
                bread,
                sides,
                drinks,
                sauces
              }
              res.status(200).send(menu);
            });
          });
        });
      });
    });
  },
  filterByType: (req, res)=>{
    let db = req.app.get('db');
    if (req.params.tab==='bread' && req.params.type==='all') {
      db.getBread().then((response)=>{
        let data = {
          dataType:'bread',
          data:response
        };
        res.status(200).send(data);
      });
    } else if (req.params.tab==='drinks' && req.params.type==='all') {
      db.getDrinks().then((response)=>{
        let data = {
          dataType:'drinks',
          data:response
        };
        res.status(200).send(data);
      })
    } else if (req.params.tab==='sauces' && req.params.type==='all') {
      db.getSauces().then((response)=>{
        let data = {
          dataType:'sauces',
          data:response
        };
        res.status(200).send(data);
      })
    } else {
      if (req.params.tab==='bread') {
        db.filterBread([req.params.type]).then((response)=>{
          let data = {
            dataType:'bread',
            data:response
          };
          res.status(200).send(data);
        })
      } else if (req.params.tab==='drinks') {
        db.filterDrinks([req.params.type]).then((response)=>{
          let data = {
            dataType:'drinks',
            data:response
          };
          res.status(200).send(data);
        })
      } else if (req.params.tab==='sauces') {
        db.filterSauces([req.params.type]).then((response)=>{
          let data = {
            dataType:'sauces',
            data:response
          };
          res.status(200).send(data);
        })
      }
    }
  },
  saveStripeToken: (req, res) => {
    let price = req.body.price,
        address = req.body.address,
        status = req.body.status,
        order_id = req.body.id,
        email = req.body.email,
        date_submitted = req.body.date_submitted,
        payment_type = req.body.type,
        order_name = req.body.order_name,
        delivery_instructions = req.body.delivery_instructions,
        cart = JSON.stringify(req.body.cart),
        user_id = req.body.user_id? req.body.user_id : null;
        db = req.app.get('db');
        
    db.submitOrder([price, address, status, order_id, email, date_submitted, payment_type, order_name, delivery_instructions, cart, user_id]).then((response)=>{
      res.status(200).send(response);
    })
  },
  getStoreLocations: (req, res) => {
    let db = req.app.get('db');
    db.getStoreLocations().then((response)=>{
      res.status(200).send(response);
    })
  },
  getUserOrders: (req, res) => {
    let db = req.app.get('db');
    db.getUserOrders([req.body.user]).then((response)=>{
      res.status(200).send(response);
    })
  },
  submitUserChange: (req, res) => {
    let db = req.app.get('db');
    let user = req.body.user;
    let text = req.body.text;
    let rbt = req.body.type;
    rbt==='firstName'?
    db.changeFirstName([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : rbt==='lastName'?
    db.changeLastName([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : rbt==='email'?
    db.changeEmail([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : rbt==='address'?
    db.changeStreetAddress([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : rbt==='city'?
    db.changeCity([text, user]).then((response)=>{
      res.status(200).send(response);
    }) :  rbt==='state'?
    db.changeState([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : rbt==='zipcode'?
    db.changeZipcode([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : rbt==='deliveryInstructions'?
    db.changeInstructions([text, user]).then((response)=>{
      res.status(200).send(response);
    }) : null  
  }
}