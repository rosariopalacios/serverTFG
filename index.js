import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt'
//Models
import Student from './models/Student.js'


// var Db = require('mongodb').Db

const connectDatabase = async () => {
    mongoose.connect('mongodb+srv://admin:admin@cluster0.34rmi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    })
 }
connectDatabase();



const app = express();


// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.post('/saveMap',  async (req, res) => {
  const { email, arrayClick } = req.body
  Student.findOneAndUpdate({ email }, { $set: { arrayClick: arrayClick }}, (err) => { console.log(err) });
})

app.post('/loginbackend', async (req, res) => {
    const { email, password } = req.body
    // Buscamos email en DB
    const usuarioDB = await Student.findOne({ email });
     // Evaluamos si existe el usuario en DB
     if(!usuarioDB){
      res.status(200).json({
        message: 'Usuario no encontrado',
      });
      return
    }

    //Comprobamos que la contraseña corresponda al usuario
    const matchPassword = bcrypt.compareSync(password, usuarioDB.password)
    if(!matchPassword) {
      res.status(200).json({
        message: 'Contraseña incorrecta',
      });
      return
    }
    

    res.status(200).json({
      message: 'Usuario logeado con éxito',
      usuario: usuarioDB
    });
})


app.post('/signUp', async (req, res) => {

  const { email, password } = req.body
  const usuarioDB = await Student.findOne({ email });
  if(usuarioDB) {
    res.status(200).json({
      message: 'Usuario ya registrado',
      usuario: usuarioDB
    })
    return
  }

    bcrypt.hash(password, 5, (err, hash) => {
      const teacher = new Student({
        email: email, 
        password: hash})
        teacher.isAdmin = true
        teacher.save()
  })

  res.status(200).json({ message: 'Usuario registrado con exito' })
})


app.post('/saveUsers', (req, res) => {
  const arrayUsersRepetead = []
    req.body.forEach((user) => {
    bcrypt.hash(user.dni, 5, async (err, hash) => {
      user.password = hash
      user.isAdmin = false
      user.arrayClick = []
      const usuarioDB = await Student.findOne({ email: user.email });
      if(!usuarioDB) {
        const studentModel = Student(user);
        studentModel.save();
      } else {
        arrayUsersRepetead.push(user.email)
      }

    });   

    if(arrayUsersRepetead.length === 0) {
      res.status(200)
      return
    } 
      res.status(200).json({
        usersWithError: arrayUsersRepetead
      })
    }) 
});

app.get('/listStudents', async (req, res) => {
  const students = await Student.find();
  res.status(200).json({
    students
  }) 
})

app.post('/saveResultForm', async (req, res) => {
  const { email, form } = req.body
  Student.findOneAndUpdate({ email }, { $set: { form }}, (err) => { console.log(err) });
  res.status(200).json({ mensaje: 'Guardado con exito' })
})

//Login

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('Example app listening on port'+ app.get('puerto'));
});