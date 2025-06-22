'use client';

import { useState, useMemo } from 'react';
import type { Student } from '@/types/student';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Download,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { StudentForm } from './student-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculateAge, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface StudentTableProps {
  students: Student[];
  onAdd: (studentData: Omit<Student, 'id' | 'fechaInscripcion'>) => void;
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentTable({ students, onAdd, onUpdate, onDelete }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(
      (student) =>
        student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cedula.includes(searchTerm) ||
        student.telefono?.includes(searchTerm) ||
        student.instrumento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingStudent(undefined);
    setIsFormOpen(true);
  }

  const handleFormSubmit = (data: Student) => {
    try {
      if (editingStudent) {
        onUpdate({ ...data, id: editingStudent.id });
        toast({
          title: 'Éxito',
          description: 'Registro de alumno actualizado correctamente.',
        });
      } else {
        onAdd(data);
        toast({
          title: 'Éxito',
          description: 'Nuevo alumno registrado correctamente.',
        });
      }
      setIsFormOpen(false);
      setEditingStudent(undefined);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Hubo un problema al guardar el registro.',
      });
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      variant: 'destructive',
      title: 'Eliminado',
      description: 'El registro del alumno ha sido eliminado.',
    });
  };
  
  const handleExport = () => {
    const dataToExport = filteredStudents.map(s => ({
      'Nombre': s.nombre,
      'Apellido': s.apellido,
      'Cédula': s.cedula,
      'Teléfono': s.telefono,
      'Fecha de Nacimiento': format(new Date(s.fechaNacimiento), 'dd/MM/yyyy'),
      'Edad': calculateAge(s.fechaNacimiento),
      'Dirección': s.direccion,
      'Instrumento': s.instrumento,
      'Fecha de Inscripción': format(new Date(s.fechaInscripcion), 'dd/MM/yyyy'),
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSX.writeFile(workbook, "registros_banda_tepuy_roraima.xlsx");
     toast({
      title: 'Exportado',
      description: 'Los registros se han exportado a Excel.',
    });
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula o instrumento..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Alumno
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Instrumento</TableHead>
                <TableHead>Fecha de Inscripción</TableHead>
                <TableHead className="w-12 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <UserCircle className="h-6 w-6" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{`${student.nombre} ${student.apellido}`}</TableCell>
                    <TableCell>{student.cedula}</TableCell>
                    <TableCell>{student.telefono}</TableCell>
                    <TableCell>{calculateAge(student.fechaNacimiento)}</TableCell>
                    <TableCell>{student.instrumento}</TableCell>
                    <TableCell>
                      {format(new Date(student.fechaInscripcion), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(student)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modificar
                            </DropdownMenuItem>
                             <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del alumno.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(student.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sí, eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron registros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{editingStudent ? 'Modificar Registro' : 'Nuevo Registro'}</DialogTitle>
          <DialogDescription>
            {editingStudent
              ? 'Modifique la información del alumno a continuación.'
              : 'Complete el formulario para registrar un nuevo alumno.'}
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          key={editingStudent?.id || 'new'}
          student={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
