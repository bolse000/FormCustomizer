// Common Interfaces and Types
//----------------------
export interface IEmailAddress {
	address: string;
}

//----------------------
export interface IMailRecipient {
	emailAddress: IEmailAddress;
}

//----------------------
export interface IMailInfo {
	mailTitle: string;
	mailBody: string;

	mailTo?: IMailRecipient[];
	mailCc?: IMailRecipient[];
}

//----------------------
export interface IUserInfo {
	empId: number;
	empLogin: string;
	empMail: string;
	empName: string;

	empFirstname?: string;
	empLastName?: string;
	empNumber?: string;
	empPhone?: string;

	empSecteur?: string;
	empDivision?: string;
	empDept?: string;

	empJobTitle?: string;
	empJobType?: string;
	empManager?: string;
	empManagerId?: number;
	empManagerName?: string;
}

//----------------------
export interface IAppLabel {
	[key: string]: string;
}
