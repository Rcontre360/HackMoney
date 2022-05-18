export type UserType = {
	data?: any;
	id: number;
	email: string;
	fullname: string;
	lastname: string;
	phoneNumber: string;
};

export type UserRegisterRequest = {
	email: string;
	name: string;
	lastName: string;
	identification: string;
	identificationType: string;
};

export type UserDataResponse = {
	id: number;
	email: string;
	name: string;
	lastname: string;
	identification: string;
	identificationType: string;
};

export type VerifyValues = {
	email: string;
	identification: string;
};

export interface AuthSession {
	accessToken?: string;
	user?: UserType;
}

export type OptionType = {
	text: string;
	value: string;
	disabled: boolean;
	placeholder: boolean;
};

export type CitiesProps = {
	id: number;
	name: string;
	imageUrl: string;
	key: string;
	boroughs?: string[];
};

export type ContactUsProps = {
	fullName: string;
	email: string;
	phoneNumber: string;
	message: string;
};

export type ContactUsResponseProps = {
	id: number;
	fullName: string;
	email: string;
	phoneNumber: string;
	message: string;
	checked: boolean;
};

export type RoomProps = {
	id: number;
	name: string;
	city: string;
	images: any[];
	address: string;
	borough: string;
	pricePerMonth: number;
	description: string;
	amenities: string[];
	bedroom: string[];
	areas: any[];
	rules: string[];
	status: string;
	coordinates: { id: number; lat: string; lng: string };
	closeProximityPointsOfInterest: string[];
	roomType: string;
};

export type Tour = {
	date: string;
	name: string;
	email: string;
	phone: string;
	coordinate_tour: boolean;
	roomId: number;
};
