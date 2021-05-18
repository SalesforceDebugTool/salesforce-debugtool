export class TraceFlag {
    Id:string;
    ExpirationDate:string;
    StartDate:string;
    TracedEntity:TracedEntity;
    DebugLevel:DebugLevel;


}

class TracedEntity {
    Id:string;
    Name:string;
}

class DebugLevel {
    Id:string;
    DeveloperName:string;
}