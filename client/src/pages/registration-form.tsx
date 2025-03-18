import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertRegistrationSchema,
  type InsertRegistration,
  type TeamMember,
} from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Control, UseFormWatch } from "react-hook-form";

const workPermitTypes = [
  "EAD (H4 / L2)",
  "Green card",
  "US citizen",
  "Canadian citizen",
  "Canadian work permit",
  "Canadian PR",
] as const;

const trackTypes = ["SDET", "DA", "DEV", "SMPO"] as const;

const timeZones = ["EST", "CST", "MST", "PST", "IST", "GMT", "Other"] as const;

interface TeamMemberFormProps {
  index: number;
  isOptional?: boolean;
  control: Control<InsertRegistration>;
  watch: UseFormWatch<InsertRegistration>;
  eventType: string;
  isBuildathon: boolean;
  isIndividualHackathon: boolean;
  hackathonType: string | null;
}

function TeamMemberForm({
  index,
  isOptional,
  control,
  watch,
  eventType,
  isBuildathon,
  isIndividualHackathon,
  hackathonType,
}: TeamMemberFormProps) {
  const track = watch(`teamMembers.${index}.track`);
  const showTrackSpecificFields =
    track === "SDET" || track === "DA" || track === "DEV" || track === "SMPO";
  const isHackathon = eventType === "Hackathon";
  const completedDSAlgo = watch(`teamMembers.${index}.completedDSAlgo`);
  const previousHackathonParticipation = watch(
    `teamMembers.${index}.previousHackathonParticipation`,
  );

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">
        Team Member {index + 1} {isOptional && "(Optional)"}
      </h3>

      {/* Build-a-thon Fields */}
      {eventType === "Buildathon" && (
        <>
          <FormField
            control={control}
            name={`teamMembers.${index}.buildathonRole`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Build-a-thon Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {buildathonRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`teamMembers.${index}.workPermit`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Permit</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work permit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EAD (H4 / L2)">EAD (H4 / L2)</SelectItem>
                    <SelectItem value="Green card">Green card</SelectItem>
                    <SelectItem value="US citizen">US citizen</SelectItem>
                    <SelectItem value="Canadian citizen">
                      Canadian citizen
                    </SelectItem>
                    <SelectItem value="Canadian work permit">
                      Canadian work permit
                    </SelectItem>
                    <SelectItem value="Canadian PR">Canadian PR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      <div className="grid grid-cols-1 gap-4">
        {" "}
        {/* Changed to grid-cols-1 */}
        <FormField
          control={control}
          name={`teamMembers.${index}.fullName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`teamMembers.${index}.email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Time Zone and Employment Status - Only for non-Build-a-thon events */}
      {!isBuildathon && (
        <>
          <FormField
            control={control}
            name={`teamMembers.${index}.timeZone`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Zone</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`teamMembers.${index}.isWorking`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Are you currently working?</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}

      {/* Track selection */}
      <FormField
        control={control}
        name={`teamMembers.${index}.track`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Track</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getAvailableTracks(hackathonType).map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Track-specific fields for SDET/DA */}
      {showTrackSpecificFields && (
        <>
          {(track === "SDET" || track === "DA") && (
            <FormField
              control={control}
              name={`teamMembers.${index}.batchCode`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isBuildathon &&
            track === "SDET" &&
             hackathonType !== "PYTHON" &&
            hackathonType !== "SQL" &&
            hackathonType !== "BLOGATHON" && (
              <FormField
                control={control}
                name={`teamMembers.${index}.completedDSAlgo`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Have you completed DSAlgo Project?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          {!isBuildathon &&
            track === "SDET" &&
            !completedDSAlgo &&
            hackathonType !== "PYTHON" &&
            hackathonType !== "SQL" &&
            hackathonType !== "BLOGATHON" && (
              <div className="text-red-500 text-sm mt-2">
                You are not eligible for this hackathon. DSAlgo project
                completion is required.
              </div>
            )}
          {(hackathonType === "API_POSTMAN" ||
            hackathonType === "API_REST Assured") && (
            <FormField
              control={control}
              name={`teamMembers.${index}.completedUserApiBootcamp`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>
                        Have you completed User API bootcamp?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  {!field.value && (
                    <div className="text-sm font-medium text-destructive">
                      You are not eligible for this hackathon. User API bootcamp
                      completion is required.
                    </div>
                  )}
                </FormItem>
              )}
            />
          )}

          {!isBuildathon &&
            track === "SDET" &&
            hackathonType !== "BLOGATHON" && (
              <FormField
                control={control}
                name={`teamMembers.${index}.previousHackathonParticipation`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>
                        {hackathonType === "PYTHON"
                          ? "Have you participated in any previous Python hackathons here at Numpy Ninja?"
                          : hackathonType === "API_POSTMAN" ||
                              hackathonType === "API_REST Assured"
                            ? "Have you participated in previous API hackathons?"
                            : hackathonType === "SQL"
                              ? "Have you participated in any previous SQL hackathons here at Numpy Ninja?"
                              : "Have you participated in previous Selenium hackathons?"}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

          {!isBuildathon && track === "DA" && hackathonType !== "BLOGATHON" && (
            <FormField
              control={control}
              name={`teamMembers.${index}.previousDAtrackHackathon`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {hackathonType === "PYTHON"
                        ? "Have you participated in any previous Python hackathons here at Numpy Ninja?"
                        : hackathonType === "API_POSTMAN" ||
                            hackathonType === "API_REST Assured"
                          ? "Have you participated in previous API hackathons?"
                          : hackathonType === "SQL"
                            ? "Have you participated in any previous SQL hackathons here at Numpy Ninja?"
                            : "Have you participated in previous hackathons?"}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {!isBuildathon &&
            track === "SDET" &&
            hackathonType === "JOBATHON" && (
              <FormField
                control={control}
                name={`teamMembers.${index}.completedAPIorSQL`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>
                        Have you completed API / SQL Hackathon?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

          {hackathonType === "PYTHON" && (
            <>
              <FormField
                control={control}
                name={`teamMembers.${index}.expertiseLevel`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Please indicate your level of expertise w.r.t in Python
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expertise level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`teamMembers.${index}.prerequisitesDocLink`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Please provide the link to your pre-requisites document.
                      Instructions for how to create the document can be found
                      here.
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="Enter document link"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {track === "SDET" &&
            previousHackathonParticipation &&
            hackathonType !== "PYTHON" &&
            hackathonType !== "BLOGATHON" &&
            hackathonType !== "JOBATHON" && (
              <>
                <FormField
                  control={control}
                  name={`teamMembers.${index}.previousHackathonDetails.phases`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Previous Hackathon Phases (Select all that apply)
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          if (!currentValues.includes(value)) {
                            field.onChange([...currentValues, value]);
                          }
                        }}
                        value={field.value?.[0]}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phases" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Phase 1 - gherkin">
                            Phase 1 - Gherkin
                          </SelectItem>
                          <SelectItem value="Phase 2 - automation">
                            Phase 2 - Automation
                          </SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watch(
                  `teamMembers.${index}.previousHackathonDetails.phases`,
                )?.includes("Both") && (
                  <FormField
                    control={control}
                    name={`teamMembers.${index}.previousHackathonDetails.bothPhasesProject`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details for Both Phases</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LMS">LMS</SelectItem>
                            <SelectItem value="Dietician">Dietician</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {watch(
                  `teamMembers.${index}.previousHackathonDetails.phases`,
                )?.includes("Phase 1 - gherkin") && (
                  <FormField
                    control={control}
                    name={`teamMembers.${index}.previousHackathonDetails.phase1Project`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase 1 - Gherkin Project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LMS">LMS</SelectItem>
                            <SelectItem value="Dietician">Dietician</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {watch(
                  `teamMembers.${index}.previousHackathonDetails.phases`,
                )?.includes("Phase 2 - automation") && (
                  <FormField
                    control={control}
                    name={`teamMembers.${index}.previousHackathonDetails.phase2Project`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase 2 - Automation Project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LMS">LMS</SelectItem>
                            <SelectItem value="Dietician">Dietician</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
        </>
      )}

      {/* Common Fields */}
    </div>
  );
}

const buildathonRoles = ["App Developer", "App Builder", "Marketing"] as const;

function getAvailableTracks(hackathonType: string | null): string[] {
  const availableTracks = [...trackTypes];
  if (hackathonType === "API_REST Assured") {
    availableTracks.splice(availableTracks.indexOf("DA"), 1);
  }
  return availableTracks;
}

export default function RegistrationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const eventType = searchParams.get("type");
  const isBuildathon = eventType === "Buildathon";
  const selectedTrack = searchParams.get("track");
  const hackathonType = searchParams.get("hackathonType");

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      eventType: eventType as "Hackathon" | "Buildathon" | "Jobathon",
      teamMembers: [
        {
          firstName: "", //This and lastName need to be removed or changed to fullName
          lastName: "", //This and firstName need to be removed or changed to fullName
          email: "",
          track: isBuildathon ? undefined : "SDET",
          groupName: "",
          buildathonRole: undefined,
          timeZone: "EST",
          isWorking: false,
          batchCode: "",
          completedJobathon: false,
          previousHackathonParticipation: false,
          previousHackathonDetails: {
            phases: [],
            projects: [],
          },
          workPermit: "US citizen",
          hackathonOption: hackathonType || "",
          previousPythonHackathon: false,
          prerequisitesDocLink: "",
          sqlExpertiseLevel: "Beginner", // Added default value
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  const isIndividualHackathon = form
    .watch("teamMembers.0.hackathonOption")
    ?.match(/(TDD\/BDD Gherkins|Selenium Automation)/);
  const completedDSAlgo = form.watch("teamMembers.0.completedDSAlgo");

  const mutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your team has been registered successfully!",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    // Check if any SDET team member hasn't completed DSAlgo
    const hasIneligibleMember = data.teamMembers.some(
      (member) => member.track === "SDET" && !member.completedDSAlgo,
    );

    if (hasIneligibleMember) {
      toast({
        title: "Registration Failed",
        description: "All SDET team members must complete the DSAlgo project.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(data);
  };

  const handleAddTeamMember = () => {
    if (fields.length < 4) {
      append({
        firstName: "", //This and lastName need to be removed or changed to fullName
        lastName: "", //This and firstName need to be removed or changed to fullName
        email: "",
        track: "SDET",
        batchCode: "",
        buildathonRole: undefined,
        workPermit: undefined,
        completedJobathon: false,
        previousHackathonParticipation: false,
        previousHackathonDetails: { phases: [], projects: [] },
        completedAPIBootcamp: false,
        previousPythonHackathon: false, // Added default value
        prerequisitesDocLink: "", // Added default value
      });
    }
  };

  return (
    <div className="min-h-screen w-full p-4 bg-gradient-to-b from-blue-50 to-white">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {eventType === "Buildathon"
              ? "Build-a-thon Registration"
              : `${hackathonType || "Hackathon"} Registration`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isBuildathon && (
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <TeamMemberForm
                    key={field.id}
                    index={index}
                    isOptional={index >= 1}
                    control={form.control}
                    watch={form.watch}
                    eventType={form.getValues("eventType")}
                    isBuildathon={isBuildathon}
                    isIndividualHackathon={!!isIndividualHackathon}
                    hackathonType={hackathonType}
                  />
                ))}
              </div>

              {isBuildathon && fields.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-4"
                  onClick={handleAddTeamMember}
                >
                  Add Team Member ({fields.length}/4)
                </Button>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
