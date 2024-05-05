const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const adminBlogRoutes = require('./routes/adminBlogRoutes');
const fundraiserRoutes = require('./routes/fundraiserRoutes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/bookmark', bookmarkRoutes);
app.use('/api/adminBlog', adminBlogRoutes);
app.use('/api/fundraiser', fundraiserRoutes);


const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT,() => {
     console.log(`Running Server on port: ${PORT}`);
      console.log("MongoDB Connected!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
