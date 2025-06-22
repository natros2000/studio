import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import type { Student } from '@/types/student';

const studentsCollectionRef = collection(db, 'students');

const fromFirestore = (snapshot: any): Student => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    nombre: data.nombre,
    apellido: data.apellido,
    cedula: data.cedula,
    telefono: data.telefono,
    fechaNacimiento: (data.fechaNacimiento as Timestamp).toDate().toISOString(),
    direccion: data.direccion,
    instrumento: data.instrumento,
    fechaInscripcion: (data.fechaInscripcion as Timestamp).toDate().toISOString(),
  };
};

export const getStudents = async (): Promise<Student[]> => {
  try {
    const q = query(studentsCollectionRef, orderBy('fechaInscripcion', 'desc'));
    const querySnapshot = await getDocs(q);
    
    // El SDK de Firestore puede devolver Timestamps o null para las fechas.
    // Para evitar errores, filtramos los documentos donde `fechaInscripcion` no es un Timestamp.
    const validDocs = querySnapshot.docs.filter(doc => doc.data().fechaInscripcion instanceof Timestamp);
    
    return validDocs.map(fromFirestore);
  } catch (error) {
    console.error("Error al obtener documentos: ", error);
    if ((error as any).code === 'failed-precondition') {
       console.error("Faltan los índices de Firestore. Revisa la consola para ver el enlace para crearlos.");
    }
    return [];
  }
};

export const addStudent = async (studentData: Omit<Student, 'id' | 'fechaInscripcion'>) => {
  await addDoc(studentsCollectionRef, {
    ...studentData,
    fechaNacimiento: Timestamp.fromDate(new Date(studentData.fechaNacimiento)),
    fechaInscripcion: serverTimestamp(),
  });
};

export const updateStudent = async (id: string, updatedData: Omit<Student, 'id'>) => {
  const studentDoc = doc(db, 'students', id);
  const dataToUpdate = {
    ...updatedData,
    fechaNacimiento: Timestamp.fromDate(new Date(updatedData.fechaNacimiento)),
    // La fecha de inscripción se mantiene, pero la convertimos a Timestamp para consistencia
    fechaInscripcion: Timestamp.fromDate(new Date(updatedData.fechaInscripcion)),
  };
  await updateDoc(studentDoc, dataToUpdate);
};

export const deleteStudent = async (id: string) => {
  const studentDoc = doc(db, 'students', id);
  await deleteDoc(studentDoc);
};
