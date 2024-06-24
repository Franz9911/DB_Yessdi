const express = require("express") 
//const app =express();
//midelware


//const pool = require('./db');
const fs = require('fs');
const path = require('path');
//const Reserva = require('./Reserva'); // Importar la clase Reserva
const Reserva = require('./Reserva');
const Libro = require('./Libro');
require('dotenv').config();

const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.send("hola a todos");
});
const filePath = path.join(__dirname, 'data.json');

app.listen(3000,()=>{
    console.log("El servidor corriendo en el puerto: 3000")
});



// Helper function to read JSON file
const readJSONFile = () => {
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
              reject(err);
          } else {
            
              resolve(JSON.parse(data));
          }
      });
  });
};

// Helper function to write JSON file
const writeJSONFile = (data) => {
  return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
          if (err) {
              reject(err);
          } else {
              resolve();
          }
      });
  });
};


// Listar usuarios
app.get("/users", async (req, res) => {
  try {
      const data = await readJSONFile();
      res.json(data.users);
  } catch (err) {
      console.log(err);
      res.status(500).send("Error de servidor");
  }
});

// Obtener usuario por ID
app.get('/users/:iduser', async (req, res) => {
  const { iduser } = req.params;
  try {
      const data = await readJSONFile();
      const user = data.users.find(u => u.iduser == iduser);
      if (!user) {
          return res.status(404).send('Usuario no encontrado');
      }
      res.json(user);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error interno');
  }
});
// Obtener usuario por cntraseña
app.get('/users/contrasenha/:contrasenha', async (req, res) => {
  //para depurar por navegador usar params y por app usar body  
  console.log("entamos") 
  const { contrasenha } = req.params;
  console.log(req.params)
  try {
      const data = await readJSONFile();
      
      const user = data.users.find(u => u.contrasenha == contrasenha);
      if (!user) {
          return res.status(404).send('Usuario no encontrado');
      }
      console.log(user)
      res.json(user);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error interno');
  }
});

// Obtener usuario por nombre ycontraseña
  app.post('/users/loguin', async (req, res) => {
    console.log("Entramos");
    const { nombre, contrasenha } = req.body;  // Usamos body para recibir los datos
    
    console.log(req);
    try {
      const data = await readJSONFile();
  
      // Buscar el usuario por nombre y contraseña
      const user = data.users.find(u => u.nombre === nombre && u.contrasenha === contrasenha);
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
  
      console.log(user);
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error interno');
    }
  });

// Insertar usuario
app.post('/users/agregar', async (req, res) => {
  const { nombre, apellidop, apellidom, contrasenha } = req.body;

  try {
      
      const data = await readJSONFile();
      var num =data.users.length;
      iduser=num+1;
      const newUser = { iduser, nombre, apellidop, apellidom, contrasenha };
      console.log(newUser);
      data.users.push(newUser);
      await writeJSONFile(data);
      res.status(201).json(newUser);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error de servidor');
  }
});


  //actualizar
  app.put('/users/:iduser', async (req, res) => {
    const { iduser } = req.params;
    const { nombre } = req.query;
    try {
      const result = await pool.query(
        'UPDATE users SET nombre = $1 WHERE iduser = $2 RETURNING *',
        [nombre, iduser]
      );
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
// Eliminar usuario
app.delete('/users/eliminar/:iduser', async (req, res) => {
  const { iduser } = req.params;
  try {
      const data = await readJSONFile();
      const index = data.users.findIndex(u => u.iduser == iduser);
      if (index === -1) {
          return res.status(404).send('Usuario no encontrado');
      }
      data.users.splice(index, 1);
      await writeJSONFile(data);
      res.status(204).send();
  } catch (err) {
      console.error(err);
      res.status(500).send('Error de servidor');
  }
});

      //libro 
      //listar
app.get("/libros", async (req, res) => {
  try {
    const data = await readJSONFile();
    res.json(data.libros);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error de servidor");
  }
});

// Obtener libro por ID
app.get('/libros/:idLibro', async (req, res) => {
  const { idLibro } = req.params;
  try {
      const data = await readJSONFile();
      const libro = data.libros.find(l => l.idLibro == idLibro);
      if (!libro) {
          return res.status(404).send('Libro no encontrado');
      }
      res.json(libro);
      console.log("hola")
  } catch (err) {
      console.error(err);
      res.status(500).send('Error interno');
  }
});

// Obtener libro por titulo
app.get('/libros/titulo/:titulo', async (req, res) => {
  const { titulo } = req.params;
  try {
      const data = await readJSONFile();
      console.log("hola");
      console.log(titulo);
      const libro = data.libros.find(l => l.titulo == titulo);
      if (!libro) {
          return res.status(404).send('Libro no encontrado');
      }
      res.json(libro);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error interno');
  }
});


  //**********reserva
// Listar todas las reservas de un usuario específico
app.get("/reservas", async (req, res) => {
  try {
    const data = await readJSONFile();
    res.json(data.reservas);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error de servidor");
  }
});


app.get("/reservas1/usuario/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;
  let reservasUsuario=[];

  const data = await readJSONFile();
  var num =data.reservas.length;
  var numLib
  for(var i =0 ;i<num;i++){
    if(data.reservas[i].idUsuario == idUsuario){
      //console.log(data.reservas[i]);
      //reservasUsuario.push(data.reservas[i])
      reservasUsuario.push(data.reservas[i])

      //reservasUsuario
    }
  }
  // Convertir reserva.idUsuario a cadena para comparación correcta
  //const reservasUsuario = data.reservas.filter(reserva => String(reserva.idUsuario) === idUsuario);
  console.log("entramos");
  console.log(reservasUsuario);
  
  console.log(num);
  res.json(reservasUsuario);
});

// Listar todas las reservas de un usuario específico, incluyendo información del libro
app.get("/reservas/usuario/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  const data = await readJSONFile();
  //console.log(data)

  if (!data.reservas) {
      return res.status(404).json({ error: "No hay reservas en la base de datos" });
  }

  let reservv = data.reservas
  .map(reservaData => Reserva.fromJSON(reservaData)) // Convertir los datos de JSON a instancias de Reserva
  .filter(reserva => String(reserva.idUsuario) === idUsuario)

  let reservLib=data.libros.map(reservaLibros=>Libro.fromJSON(reservaLibros))
  
  
  //console.log(reservLib)

  reservv.forEach((e)=> {
    reservLib.forEach((libro)=>{
      if(e.idLibro==libro.idLibro){
        console.log("dentro")
        console.log(libro.imagenL)
        e.costo=parseInt(libro.costo*e.unidades)+""
        e.imagenL=libro.imagenL;
        e.titulo=libro.titulo;
      }
    
    
    //console.log(element)
    
  });
  });
  //const reservasUsuario = data.reservas
  //.map(reservaData => Reserva.fromJSON(reservaData)) // Convertir los datos de JSON a instancias de Reserva
  /*.filter(reserva => String(reserva.idUsuario) === idUsuario)
  .map(reserva => {
      const libroData = data.libros.find(libro => libro.id == reserva.idLibro);

      const libro = libroData ? new Libro(libroData.id, libroData.titulo, libroData.isbn, libroData.resumen, libroData.autor) : null;
      return {
          ...reserva.toJSON(),
          libro: libro ? libro.toJSON() : null
      };
  });*/
//console.log(reservasUsuario);
res.json(reservv);
});

// Eliminar reserva
app.delete('/reserva/eliminar/:idReserva', async (req, res) => {
  console.log("entramos eliminar reserva ");
  const { idReserva } = req.params;
  try {
      const data = await readJSONFile();
      const index = data.reservas.findIndex(u => u.idReserva == idReserva);
      console.log("index= "+index)
      if (index === -1) {
          return res.status(404).send('reserva no encontrado');
      }
      data.reservas.splice(index, 1);
      await writeJSONFile(data);
      res.status(204).send();
  } catch (err) {
      console.error(err);
      res.status(500).send('Error de servidor');
  }
});

// Insertar reserva
app.post('/reserva/agregar/', async (req, res) => {
  const { idLibro, idUsuario, fechaReserva, estado,unidades,fechaResecion } = req.body;
  //console.log(req);
  try {
      
      const data = await readJSONFile();
      var num =data.reservas.length;
      idReserva=num+1;
      const newReserva = {idReserva, idLibro, idUsuario, fechaReserva, estado,unidades,fechaResecion };
      console.log(newReserva);
      data.reservas.push(newReserva);
      await writeJSONFile(data);
      res.status(201).json(newReserva);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error de servidor');
  }
});