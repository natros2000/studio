'use client';

import type { Student } from '@/types/student';

const LOCAL_STORAGE_KEY = 'banda_show_tepuy_roraima_students';

const getInitialStudents = (): Student[] => {
  return [
    {
      id: '1',
      nombre: 'Carlos',
      apellido: 'Pérez',
      cedula: 'V-25.123.456',
      telefono: '0414-1234567',
      fechaNacimiento: '2005-03-15T00:00:00.000Z',
      direccion: 'Av. Principal, Casa #10, Santa Elena',
      instrumento: 'Trompeta',
      fechaInscripcion: '2023-01-20T00:00:00.000Z',
    },
    {
      id: '2',
      nombre: 'Ana',
      apellido: 'Gomez',
      cedula: 'V-26.987.654',
      telefono: '0412-7654321',
      fechaNacimiento: '2006-07-22T00:00:00.000Z',
      direccion: 'Calle 2, Edificio Roraima, Apto 5B',
      instrumento: 'Clarinete',
      fechaInscripcion: '2023-02-11T00:00:00.000Z',
    },
    {
      id: '3',
      nombre: 'Luis',
      apellido: 'Rodriguez',
      cedula: 'V-24.555.888',
      telefono: '0424-9876543',
      fechaNacimiento: '2004-11-02T00:00:00.000Z',
      direccion: 'Urb. Tepuy, Vereda 3',
      instrumento: 'Batería',
      fechaInscripcion: '2022-11-30T00:00:00.000Z',
    },
  ];
};

export const getStudents = (): Student[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const studentsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (studentsJSON) {
    const students = JSON.parse(studentsJSON);
    // Data migration for existing users who don't have the `telefono` field
    return students.map((s: any) => ({ ...s, telefono: s.telefono || 'N/A' }));
  } else {
    const initialStudents = getInitialStudents();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStudents));
    return initialStudents;
  }
};

export const addStudent = (studentData: Omit<Student, 'id' | 'fechaInscripcion'>) => {
  const students = getStudents();
  const newStudent: Student = {
    ...studentData,
    id: new Date().getTime().toString(),
    fechaInscripcion: new Date().toISOString(),
  };
  const updatedStudents = [...students, newStudent];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStudents));
};

export const updateStudent = (id: string, updatedData: Omit<Student, 'id'>) => {
  const students = getStudents();
  const updatedStudents = students.map((student) =>
    student.id === id ? { ...student, ...updatedData } : student
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStudents));
};

export const deleteStudent = (id: string) => {
  const students = getStudents();
  const updatedStudents = students.filter((student) => student.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStudents));
};
