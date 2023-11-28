const express = require('express');
const cors =require('cors');
const  mongoose  = require('mongoose');
const User =require('./models/User.js');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app =express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const Place =require('./models/Place.js');
const Booking =require('./models/Booking.js');

const bcryptSalt =bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(
  cors({
    origin: 'http://homily-frontend.vercel.app',
    credentials: true,
    methods: ["POST", "GET"],
    optionsSuccessStatus: 204, // Add this line
  })
);

// Wrap mongoose.connect in a try-catch block
try {
    mongoose.connect('mongodb+srv://sajal:Mongoose@cluster1.qkp4og7.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  }
app.get('/test' ,(req,res)=>{
    res.json('test done');
});
app.get('/', (req, res) => {
  res.send('Welcome to the Homily API');
});


app.post('/places', async (req, res) => {
  const { token } = req.cookies;

  // Log the received token for debugging
  console.log('Received Token:', token);

  // Handle the case where the token is missing
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title: req.body.title,
        address: req.body.address,
        photos: req.body.addedPhotos,
        description: req.body.description,
        perks: req.body.perks,
        extraInfo: req.body.extraInfo,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        maxGuests: req.body.maxGuests,
        price: req.body.price,
      });

      res.json(placeDoc);
    } catch (e) {
      console.error('Error creating place:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const userDoc =await User.findOne({email});
    if(userDoc)
    {
        const passOk =bcrypt.compareSync(password ,userDoc.password);
        if(passOk) 
        {
            jwt.sign({email:userDoc.email ,id:userDoc._id},jwtSecret ,{} ,(err,token)=>{
                if(err) throw err;
                res.cookie('token',token).json(userDoc);
            });
           
        }
        else
        {
            res.status(422).json('pass not ok');
        }
    }
    else
    {
                res.json('not found');
    }
});
app.get('/profile', (req,res) => {
   
    const {token} = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name,email,_id} = await User.findById(userData.id);
        res.json({name,email,_id});
      });
    } else {
      res.json(null);
    }
  });
  
app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
  });

  app.post('/upload-by-link', async (req,res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: __dirname +'/uploads/'+newName,
    });
    res.json(newName);
  });  

  const photosMiddleware = multer({ dest: '/tmp/uploads/' });
  app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace('uploads', '')); 
      
    }
    res.json(uploadedFiles);
  });
  
  app.post('/places',(req,res)=>{

    const {token} = req.cookies;

    const{
        title ,address ,addedPhotos ,
        description ,perks,extraInfo,
        checkIn ,checkOut ,maxGuests,price,
    }=req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc =  await Place.create({
            owner:userData.id,
            title ,address ,photos:addedPhotos ,
        description ,perks,extraInfo,
        checkIn ,checkOut ,maxGuests,price,
        })
        res.json(placeDoc);
      });
    
  })

  app.get('/user-places', (req,res) => {
    
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      const {id} = userData;
      res.json( await Place.find({owner:id}) );
    });
  });
  app.get('/places/:id', async (req,res) => {
    
    const {id} = req.params;
    res.json(await Place.findById(id));
  });
  app.put('/places', async (req,res) => {
   
    const {token} = req.cookies;
    const {
      id, title,address,addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,address,photos:addedPhotos,description,
          perks,extraInfo,checkIn,checkOut,maxGuests,price,
        });
        await placeDoc.save();
        res.json('ok');
      }
    });
  });
  app.get('/places', async (req,res) => {
   
    res.json( await Place.find() );
  });

  function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    });
  }
  app.post('/bookings', async (req, res) => {
    
    const userData = await getUserDataFromReq(req);
    const {
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
    } = req.body;
    Booking.create({
      place,checkIn,checkOut,numberOfGuests,name,phone,price,
      user:userData.id,
    }).then((doc) => {
      res.json(doc);
    }).catch((err) => {
      throw err;
    });
  });
  
  app.get('/bookings', async (req,res) => {
   
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('place') );
  });
  
app.listen(4000, () => {
    console.log("Server is Running")
})
