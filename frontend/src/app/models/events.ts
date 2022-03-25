import Registration from "./registrations";

export default class Event {

    eventDescription!: string;
    eventCreatedByUserId!: string;
    creationDate!: Date;
    eventDateTime!: Date;
    eventType!: String;
    _id!: string;
    eventOtherDesc!: string;
    eventBuyin!: string;
    eventRebuys!: string;
    eventMaxRegs!: string;
    eventCurrentRegs!: string;
    registration: Array<Registration>=[];
}
