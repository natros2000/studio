'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { StudentTable } from '@/components/student-table';
import type { Student } from '@/types/student';
import { getStudents, addStudent, updateStudent, deleteStudent } from '@/lib/student-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // The service uses localStorage, which is only available on the client.
    // We also add a small delay to show the loading state.
    const timer = setTimeout(() => {
      setStudents(getStudents());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDataChange = () => {
    setStudents(getStudents());
  };

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'fechaInscripcion'>) => {
    addStudent(studentData);
    handleDataChange();
  };

  const handleUpdateStudent = (student: Student) => {
    updateStudent(student.id, student);
    handleDataChange();
  };

  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    handleDataChange();
  };

  return (
    <div className="min-h-screen w-full">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        ) : (
          <StudentTable
            students={students}
            onAdd={handleAddStudent}
            onUpdate={handleUpdateStudent}
            onDelete={handleDeleteStudent}
          />
        )}
      </main>
    </div>
  );
}
