const express =  require('express');
const env = require('dotenv');
const bodyParser =  require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const AppError =  require('./utils/appError');
const globalErrorHandler =  require('./controller/error')
const rateLimiter =  require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize =  require('express-mongo-sanitize');
//routes
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const tourRoutes = require('./routes/tour');
const userRoutes = require('./routes/user');
const reviewRoutes =  require('./routes/review');
const bookingRoutes =  require('./routes/bookings');

const limiter =  rateLimiter({
 max:1000,
 windowMS: 60 * 60 * 1000,
 message:'Too many request from the api! please try an hour later'
});
//environment or const
env.config();

//mongodb connection
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.obfix.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
). then(() => {
  console.log('Database connected')
});

app.get('/', (req,res,next) => {
  res.status(200).json({message:"sucesss"})
});

app.listen(process.env.PORT, () => {
 console.log(`server is running ${process.env.PORT}`)
});

app.use(helmet());
app.use('/api',limiter);
app.use(cors());
app.use(express.json({limit:'100kb'}));
app.use(mongoSanitize());
app.use('/api', authRoutes);
app.use('/api', adminAuthRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', tourRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes);
app.use('/api', bookingRoutes);

app.all('*',(req,res,next)=>{
//   res.status(404).json({
// status:'Fail',
// message:`cannot find the ${req.originalUrl} on this server`
//   });

//   const err = new Error(`cannot find the ${req.originalUrl} on this server`);
//   err.status= 'Fail';
//   err.statusCode = 404;

  next(new AppError(`cannot find the ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

process.on

