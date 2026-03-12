import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClassDetails } from "@/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useShow } from "@refinedev/core";

const ShowClass = () => {
    const { query } = useShow<ClassDetails>({ resource: "classes" });
    const ClassDetails = query.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !ClassDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                <p className="state-message">
                    {isLoading ? "Loading..."
                        : isError ? "Failed to load class details."
                            : "No class details found."}</p>
            </ShowView>
        )
    }

    const teacherName = ClassDetails.teacher?.name ?? "Unknown";
    const { subject, department, teacher, name, description, status, capacity } = ClassDetails;
    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader resource="classes" title="Class Details" />
            <Card className="details-card">
                <div className="details-header">
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>
                    <div>
                        <Badge variant="outline"> {capacity} spots</Badge>
                        <Badge variant={status === "active" ? "default" : "secondary"}
                            data-status={status}>{status.toUpperCase()} </Badge>
                    </div>
                </div>
                <div className="details-grid">
                    <div className="instructor">
                        <p>Instructor</p>
                        <div>
                            <p>{teacherName}</p>
                            <br />
                            <p>{teacher?.email}</p>
                        </div>
                    </div>
                    <div className="department">
                        <p>Department</p>
                        <div>
                            <p>{department?.name}</p>
                            <p>{department?.description}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="subject">
                    <p>Subject</p>
                    <div>
                        <Badge variant="outline">Code: {subject?.code}</Badge>
                        <p>{subject?.name}</p>
                        <p>{subject?.description}</p>
                    </div>
                </div>
                <Separator />
                <div className="join">
                    <h2>Join Class</h2>
                    <ol>
                        <li>Ask your teacher for invite code</li>
                        <li>Click on "Join Class" button</li>
                        <li>Paste the code and click "join"</li>
                    </ol>
                </div>
                <Button size="lg" className="w-full">Join class</Button>
            </Card>
        </ShowView>
    );
}

export default ShowClass;