export enum GenderEnum {
    Female = "Female",
    Male = "Male",
}
export enum IDTypeEnum {
    Aadhar = "Aadhar",
    PAN = "PAN",
}

export interface FormValues {
    Name: string;
    Age: string;
    Sex: GenderEnum;
    Mobile?: string;
    ID_type: IDTypeEnum;
    ID?: string;
    Country?: string | null;
    City?: string | null;
    State?: String | null;
    Pincode?: string;
    Address?: string | null
}

export interface ResponseInterface {
    status: number;
    msg: string;
    rData?: Record<any, any>
}