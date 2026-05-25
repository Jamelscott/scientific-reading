import { SchoolUser, Teacher, BoardUser, AdminUser } from "./types"

export const admins = [
    {
      type: "admin" as const,
      id: "a-1",
      name: "Admin",
      email: "admin@gmail.com",
      password:"12345",
    },
] as AdminUser[]

export const boards = [
    {
      type: "board" as const,
      id: "b-1",
      name: "Commission scolaire de Montréal",
      email: "jean-luc.bouchard@ecole.qc.ca",
      password:"12345",
    },
] as BoardUser[]

export const schools = [
    {
      type: "school" as const,
      id: "s-1",
      name: "École Primaire Saint-Laurent",
      email: "direction@saint-laurent.qc.ca",
      boardId: "b-1",
      password:"12345",
    }
] as SchoolUser[]

export const teachers = [
    {
      type: "teacher" as const,
      id: "t-1",
      name: "Madame Gisèle Tremblay",
      email: "gisele.tremblay@ecole.qc.ca",
      schoolId: "s-1",
      boardId:"b-1",
      password:"12345",
      phoneNumber: "(514) 555-0123",
      startDate: "Septembre 2018",
      yearsExperience: 12,
    },
        {
      type: "teacher" as const,
      id: "t-2",
      name: "Monsieur Jean-Pierre Dubois",
      email: "jean-pierre.dubois@ecole.qc.ca",
      schoolId: "s-1",
      boardId: "b-1",
      password:"12345",
      phoneNumber: "(514) 555-0123",
      startDate: "Septembre 2018",
      yearsExperience: 12,  
    },
] as Teacher[]