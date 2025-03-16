import { pgTable, text, serial, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const workPermitEnum = [
  "EAD (H4 / L2)",
  "Green card",
  "US citizen",
  "Canadian citizen",
  "Canadian work permit",
  "Canadian PR"
] as const;

const trackEnum = [
  "SDET",
  "DA",
  "DEV",
  "SMPO"
] as const;

const buildathonRoleEnum = [
  "App Developer",
  "App Builder",
  "Marketing"
] as const;

const timeZoneEnum = [
  "EST",
  "CST",
  "MST",
  "PST",
  "IST",
  "GMT",
  "Other"
] as const;

const hackathonOptionsForDA = [
  "DATATHON",
  "API-phase1 (POSTMAN)",
  "PYTHON",
  "BLOGATHON",
  "SQL"
] as const;

const hackathonOptionsForSDET = [
  "TDD/BDD Gherkins",
  "Selenium Automation",
  "API_POSTMAN",
  "API_REST Assured",
  "Python SDET",
  "Blogathon",
  "RECIPE SCRAPING HACKATHON",
  "SQL"
] as const;

const hackathonOptionsForDEVSMPO = [
  "TDD/BDD Gherkins",
  "Selenium Automation",
  "API_POSTMAN",
  "API_REST Assured",
  "Python SDET",
  "Blogathon",
  "SQL"
] as const;

const teamMemberSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  buildathonRole: z.enum(buildathonRoleEnum, {
    errorMap: () => ({ message: "Please select a valid role" })
  }),
  track: z.enum(trackEnum, {
    errorMap: () => ({ message: "Please select a valid track" })
  }),
  completedDSAlgo: z.boolean().optional(),
  completedJobathon: z.boolean().optional(),
  completedAPIBootcamp: z.boolean({
    required_error: "Please indicate if you have completed the User API bootcamp"
  }),
  previousPythonHackathon: z.boolean().optional(),
  previousHackathonParticipation: z.boolean().optional(),
  previousHackathonDetails: z.object({
    phases: z.array(z.enum(["Phase 1 - gherkin", "Phase 2 - automation", "Both"])).optional(),
    projects: z.array(z.enum(["LMS", "Dietician", "Both"])).optional(),
  }).optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  timeZone: z.enum(timeZoneEnum, {
    errorMap: () => ({ message: "Please select a valid time zone" })
  }).optional(),
  isWorking: z.boolean().optional(),
  batchCode: z.string().optional(),
  workPermit: z.enum(workPermitEnum, {
    errorMap: () => ({ message: "Please select a valid work permit type" })
  }),
  hackathonOption: z.string().optional(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  isIndividual: text("is_individual").notNull(),
  teamMembers: json("team_members").notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrations)
  .pick({
    eventType: true,
  })
  .extend({
    eventType: z.enum(["Hackathon", "Buildathon"]),
    isIndividual: z.boolean().default(false),
    teamMembers: z.array(teamMemberSchema)
      .refine(
        (members) => {
          const isIndividual = members[0]?.hackathonOption?.match(
            /(TDD\/BDD Gherkins|Selenium Automation|API_POSTMAN|API_REST Assured|Python|RECIPE SCRAPING HACKATHON|DATATHON|BLOGATHON|SQL|JOBATHON)/
          );
          if (isIndividual) {
            return members.length === 1;
          }
          return members.length >= 3 && members.length <= 4;
        },
        (members) => ({
          message: members[0]?.hackathonOption?.match(
            /(TDD\/BDD Gherkins|Selenium Automation|API_POSTMAN|API_REST Assured|Python|RECIPE SCRAPING HACKATHON|DATATHON|BLOGATHON|SQL|JOBATHON)/
          )
            ? "Individual registration requires exactly 1 member"
            : "Team registration requires 3-4 members"
        })
      ),
  });

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type TeamMember = z.infer<typeof teamMemberSchema>;

export const getHackathonOptionsForTrack = (track: string) => {
  switch (track) {
    case "DA":
      return hackathonOptionsForDA.filter(option => option !== "API_REST Assured");
    case "SDET":
      return hackathonOptionsForSDET;
    case "DEV":
    case "SMPO":
      return hackathonOptionsForDEVSMPO;
    default:
      return [];
  }
};

export const isIndividualHackathon = (hackathonType: string) => {
  return hackathonType.match(
    /(TDD\/BDD Gherkins|Selenium Automation|API_POSTMAN|API_REST Assured|Python|RECIPE SCRAPING HACKATHON|DATATHON|BLOGATHON|SQL|JOBATHON)/
  ) !== null;
};