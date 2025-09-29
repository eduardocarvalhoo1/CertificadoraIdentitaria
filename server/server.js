const app = require('./config/express')();
const port = app.get('port');
const db = require("./config/firestoreConfig");
const { ref, set, get, child } = require("firebase/database");

// Teste de conexão Firebase
async function testarFirebase() {
  try {
    const testRef = ref(db, "conexao_teste");
    
    // Escreve um valor temporário
    await set(testRef, {
      status: "ok",
      timestamp: new Date().toISOString()
    });

    // Lê o valor salvo
    const snapshot = await get(child(ref(db), "conexao_teste"));
    if (snapshot.exists()) {
      console.log("✅ Conexão Firebase funcionando:", snapshot.val());
    } else {
      console.log("⚠️ Não conseguiu ler os dados do Firebase.");
    }
  } catch (error) {
    console.error("❌ Erro ao conectar com Firebase:", error);
  }
}

app.listen(port, async () => {
	console.log(`server runing in port ${port}`);
  	await testarFirebase();
});
