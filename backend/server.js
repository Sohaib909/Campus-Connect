const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const app = require('./app');

dotenv.config({path: './config.env'})


mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection to Database Successful.');
  })
  .catch((error) => {
    console.log('Connection to Database Failed');
    console.error(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

