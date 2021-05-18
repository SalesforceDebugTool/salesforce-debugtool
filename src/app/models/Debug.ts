export class Debug {
    Id:string;
    StartTime:Date;
    StartTimeSTR:string;
    LogLength:number;
    Operation:string;
    Request:string;
    Status:string;
    DurationMilliseconds:number ;
    Application:string;
    LastModifiedDate:string;
    SystemModstamp:string;
    Location:string;
    color:string;
    textFile:string;
    textFileStatuse:string;
    LogUser:User;


}

class User {
    Id:string;
    Name:string;
}
