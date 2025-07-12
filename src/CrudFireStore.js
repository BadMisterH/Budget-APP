import {collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

import { db } from "../firebase-config.js";

export async function addTransaction(transaction) {
  try {
    const docRef = await addDoc(collection(db, "transactions"), transaction);
    console.log("Transaction ajoutée avec l'ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout: ", error);
    throw error;
  }
}

export async function getTransactions() {
  try {
    const transactionsRef = collection(db, "transactions");
    const querySnapshot = await getDocs(transactionsRef);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error("Erreur lors de la récupération: ", error);
    throw error;
  }
}

export async function supprimerTransaction(id) {
  try {
    // Référence au document à supprimer
    const docRef = doc(db, "transactions", id);
    console.log(id)

    
    // Supprimer le document
    await deleteDoc(docRef);
    console.log("Document supprimé avec succès:", id);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
}
