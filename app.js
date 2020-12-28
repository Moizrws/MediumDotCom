const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/usersRoutes');
const storiesRoutes = require('./routes/storiesRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const methodOverride = require('method-override');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();

mongoose.Promise = global.Promise;

//if (process.env.NODE_ENV == 'development') {
 mongoose.connect(process.env.DATABASE_LOCAL,{ useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(err){
      console.log(err);
  }
  console.log(`mongo db connected sucessfully`);
});
//}

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "medium.com apis",
      description: "Medium,com API Information",
      contact: {
        name: "Moiz Chhatriwala"
      },
      servers: ["http://localhost:3050"]
    }
  },
  apis: ['./routes/usersRoutes.js','./routes/storiesRoutes.js','./routes/publicationRoutes.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// for parsing application/json
app.use(bodyParser.json());

app.use(express.static('../views'));

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded
app.use(methodOverride('_method'));

app.set('view engine','ejs');


//routes(app);
app.use('/api/users', userRoutes);
app.use('/api/stories', storiesRoutes);//
app.use('/api/publication', publicationRoutes);


app.use((err, req, res, next) => {
  res.status(400).send({ error: err.message,sucess:false });
});

module.exports = app;
