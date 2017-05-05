import mongoose from 'mongoose';
import Recipe from './models/Recipe';
import Order from './models/Order';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import ioRequire from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = ioRequire(server);


const databaseURL = process.env.MONGODB_URI || 'mongodb://localhost/fobar';

mongoose.Promise = Promise;

mongoose.connect(databaseURL);

app.use(bodyParser.json({limit: '150mb'}));

app.get('/', (request, response) => {
  response.send('Welcome to FOBar');
});

app.get('/recipes', (request, response) => {
  Recipe.find({}, (error, recipes) => {
    if (error) {
      response.status(501).send({error});
    } else {
      response.send(recipes);
    }
  });
});

app.post('/recipes', (request, response) => {
  const { name, directions, description, image } = request.body;

  const newRecipe = new Recipe({
    name,
    directions, 
    description, 
    image
  });

  newRecipe.save((error) => {
    if (error) {
      response.send({error});
    } else {
      response.status(201).send(newRecipe);
    }
  });

});

app.delete('/recipes/:id', (request, response) => {
  const { id } = request.params;

  Recipe.findOneAndRemove({_id: id}, (error) => {
    if (error) throw error;

    response.sendStatus(200);
  });
});

app.get('/orders', (request, response) => {
  Order.find({}, (error, orders) => {
    if (error) {
      resposne.status(501).send({error});
    } else {
      response.send(orders);
    }
  })
});

app.post('/orders', (request, response) => {
  const { customerName, notes, phoneNumber, quantity, recipeID } = request.body;
  const newOrder = new Order({
    customerName,
    notes,
    phoneNumber,
    quantity,
    recipeID
  });

  newOrder.save((error) => {
    if (error) {
      response.send({error});
    } else {
      io.emit('update', {newOrder: 'new order has been made'});
      response.status(201).send({message: 'Drink Ordered'});
    }
  });
});

app.post('/orders/:id/finish', (request, response) => {
  Order.findByIdAndUpdate(request.params.id, { finishedDate: new Date()}, (error, order) => {
    if (error) throw error;
    io.emit('update', {newOrder: 'new order has been finished'});
    response.send(order);
  })
});

app.delete('/orders/:id', (request, response) => {
  const { id } = request.params;

  Order.findOneAndRemove({_id: id}, (error) => {
    if (error) throw error;

    response.sendStatus(200);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server it listening at port ', port);
});

process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    process.exit()
  });
});