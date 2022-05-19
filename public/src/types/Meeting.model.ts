export default interface IMeeting {
    ID: string | never ;
    START_DATE: Date;
    END_DATE: Date
    INICIATOR_ID:string | never
    MEMBERS: string[] | never[]
    GUESTS: string[] | never[]
}