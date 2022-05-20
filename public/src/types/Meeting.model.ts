export default interface IMeeting {
    ID: string | never ;
    START_DATE: Date | number;
    END_DATE: Date | number
    INICIATOR_ID:string | never
    MEMBERS: string[] | never[]
    GUESTS: string[] | never[]
}