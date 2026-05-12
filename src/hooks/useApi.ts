import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "../../mockData";

// Students
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: mockApi.getStudents,
  });
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => mockApi.getStudentById(id),
    enabled: !!id,
  });
}

export function useStudentsByClass(classId: number) {
  return useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => mockApi.getStudentsByClassId(classId),
    enabled: !!classId,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      classIds = [],
    }: {
      name: string;
      classIds?: number[];
    }) => mockApi.createStudent(name, classIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });
}

export function useUpdateStudentResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      questionLabel,
      correct,
      note,
    }: {
      id: number;
      questionLabel: string;
      correct: boolean | null;
      note?: string;
    }) => mockApi.updateStudentResponse(id, questionLabel, correct, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
  });
}

// Classes
export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: mockApi.getClasses,
  });
}

export function useClass(id: number) {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => mockApi.getClassById(id),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}


// Evaluations
export function useStudentResponsesByClass(classId: number) {
  return useQuery({
    queryKey: ["evaluations", "class", classId],
    queryFn: () => mockApi.getStudentResponsesByClassId(classId),
    enabled: !!classId,
  });
}

export function useStudentResponsesByStudentAndClass(studentId: number, classId: number) {
  return useQuery({
    queryKey: ["evaluations", "student", studentId, "class", classId],
    queryFn: () => mockApi.getStudentResponsesByStudentAndClass(studentId, classId),
    enabled: !!studentId && !!classId,
  });
}

// Notifications
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: mockApi.getNotifications,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => mockApi.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
