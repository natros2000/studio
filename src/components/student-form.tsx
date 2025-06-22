'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Student } from '@/types/student';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  apellido: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres.' }),
  cedula: z.string().min(5, { message: 'La cédula es requerida.' }),
  fechaNacimiento: z.date({
    required_error: 'La fecha de nacimiento es requerida.',
  }),
  direccion: z.string().min(10, { message: 'La dirección debe tener al menos 10 caracteres.' }),
  instrumento: z.string().min(2, { message: 'El instrumento es requerido.' }),
});

type StudentFormValues = z.infer<typeof formSchema>;

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const defaultValues = student ? {
    ...student,
    fechaNacimiento: new Date(student.fechaNacimiento),
  } : {
    nombre: '',
    apellido: '',
    cedula: '',
    fechaNacimiento: undefined,
    direccion: '',
    instrumento: '',
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: StudentFormValues) => {
    onSubmit({
      ...values,
      fechaNacimiento: values.fechaNacimiento.toISOString(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="cedula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cédula de Identidad</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: V-25.123.456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'dd LLL, y', { locale: es })
                        ) : (
                          <span>Seleccione una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1950-01-01')
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instrumento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrumento</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Trompeta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: Av. Principal, Casa #10, Santa Elena de Uairén"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {student ? 'Guardar Cambios' : 'Registrar Alumno'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
