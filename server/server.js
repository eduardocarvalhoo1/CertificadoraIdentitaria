const app = require('./config/express')(); 
const port = app.get('port'); 
const { admin }= require("./config/firestoreConfig"); // <- this exports firebase-admin 
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const cors = require('cors');

// Importar rotas
const userRouter = require('./routes/user.routes');
const professorRouter = require('./routes/professor.routes');
const alunoRouter = require('./routes/aluno.routes'); 
const oficinaRouter = require('./routes/oficina.routes');
const publicRouter = require('./routes/public.routes'); // <-- Nova rota pública

require('dotenv').config({ path: './config/.env' });

// Middlewares
app.use(cors());
// ... (existing cors config)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type", "Authorization"]
}));

// Montar rotas
app.use('/api/public', publicRouter); // <-- Rota pública (sem auth)
app.use('/api/auth', userRouter);                                 
app.use('api/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile)); // swagger config 
app.use('/api/professor', professorRouter); 
app.use('/api/alunos', alunoRouter);
app.use('/api/oficinas', oficinaRouter); 

// Iniciar servidor
app.listen(port, async () => { 
// ... (existing server start logic)
// ... (existing code) ...
  console.log(`server running on port ${port}`); 
  try { 
// ... (existing code) ...
    const db = admin.firestore(); 
    await db.collection("connectionTest").doc("ping").set({ 
// ... (existing code) ...
      timestamp: new Date(), 
      status: "ok" 
// ... (existing code) ...
    }); 
    const doc = await db.collection("connectionTest").doc("ping").get(); 
// ... (existing code) ...
    if (doc.exists) { 
      console.log("✅ Firestore connection OK:", doc.data()); 
// ... (existing code) ...
    } else { 
      console.log("⚠️ Could not read test document"); 
// ... (existing code) ...
    } 
  } catch (err) { 
// ... (existing code) ...
    console.error("❌ Firestore connection failed:", err); 
  } 
});