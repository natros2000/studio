'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppHeader } from '@/components/app-header';
import { StudentTable } from '@/components/student-table';
import type { Student } from '@/types/student';
import { getStudents, addStudent, updateStudent, deleteStudent } from '@/lib/student-service';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const studentData = await getStudents();
      setStudents(studentData);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error de Carga',
        description: 'No se pudieron cargar los datos. Verifique la configuración de Firebase y la consola para más detalles.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // We add a small delay to show the loading state.
    const timer = setTimeout(() => {
        fetchStudents();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'fechaInscripcion'>) => {
    await addStudent(studentData);
    await fetchStudents();
  };

  const handleUpdateStudent = async (student: Student) => {
    const { id, ...data } = student;
    await updateStudent(id, data);
    await fetchStudents();
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteStudent(id);
    await fetchStudents();
  };

  return (
    <div className="min-h-screen w-full bg-background">
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
