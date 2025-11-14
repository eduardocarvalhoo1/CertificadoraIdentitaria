const { db } = require('../config/firestoreConfig');
const salasCollection = db.collection("salas");
const oficinasCollection = db.collection("oficinas");

async function verifyVagas(nome, vagas) {
    try { 
        const snapshot = await salasCollection.where("nome", "==", nome).get();
        if(snapshot.empty) {
            throw new Error("Sala não encontrada.");
        } 
        const salaDoc = snapshot.docs[0];
        const salaData = salaDoc.data();

        if (vagas > salaData.capacidade) {
            return {
                ok: false,
                message: "Capacidade da sala é insuficiente para a quantidade de vagas."
            }
        }

        return {
            ok: true,
            message: "Capacidade suficiente para a quantidade de vagas disponibilizada."
        }

    } catch (err) {
        return {
            ok: false,
            message: err.message
        };
    }
}

async function datesOverlap(local, dataInicio, dataFim) {
    try {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        const snapshot = await oficinasCollection.where("local", "==", local).get();
        const hasConflict = snapshot.docs.some(doc => { 
            return inicio < new Date(doc.data().dataFim) && fim > new Date(doc.data().dataInicio);
        });
        return hasConflict;
    } catch (err) {
        return false;
    }
}

module.exports = {
    verifyVagas,
    datesOverlap,
}