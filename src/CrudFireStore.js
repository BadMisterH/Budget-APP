import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase-config.js";


export async function addTransaction(transaction) {
  try {
    // ✅ Vérifier que l'utilisateur est connecté
    if (!auth.currentUser) {
      throw new Error("Utilisateur non connecté");
    }

    // ✅ Ajouter l'ID de l'utilisateur à la transaction
    const transactionWithUser = {
      ...transaction,
      userId: auth.currentUser.uid // Associer à l'utilisateur connecté
    };

    const docRef = await addDoc(collection(db, "transactions"), transactionWithUser);
    console.log("Transaction ajoutée avec l'ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout: ", error);
    throw error;
  }
}

export async function getTransactions() {
  try {
    // ✅ Vérifier que l'utilisateur est connecté
    if (!auth.currentUser) {
      throw new Error("Utilisateur non connecté");
    }

    // ✅ Créer une requête filtrée par utilisateur
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    console.log(`📊 ${transactions.length} transactions trouvées pour ${auth.currentUser.email}`);
    return transactions;
  } catch (error) {
    console.error("Erreur lors de la récupération: ", error);
    throw error;
  }
}

export async function supprimerTransaction(id) {
  try {
    // ✅ Vérifier que l'utilisateur est connecté
    if (!auth.currentUser) {
      throw new Error("Utilisateur non connecté");
    }

    // Référence au document à supprimer
    const docRef = doc(db, "transactions", id);
    console.log(id);

    // Supprimer le document
    await deleteDoc(docRef);
    console.log("Document supprimé avec succès:", id);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
}


