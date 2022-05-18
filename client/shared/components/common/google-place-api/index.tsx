import * as React from 'react';
import Script from 'next/script';
import {
	DeepMap,
	FieldError,
	FieldValues,
	UseFormClearErrors,
	UseFormSetError,
	UseFormSetValue,
} from 'react-hook-form';
import { Input } from 'components/common/form/input';
import { GooglePlaceAPIContext } from 'context';

interface PropsGooglePlaceAPI {
	tokenGoogleAPI: string;
	restrictionsCountries?: string[];
	rules: any;
	errors: DeepMap<FieldValues, FieldError>;
	register: FieldValues;
	setValue: UseFormSetValue<FieldValues>;
	watch: boolean;
	className: string;
	cityOurs?: any[] | undefined;
	setError: UseFormSetError<FieldValues>;
	clearErrors: UseFormClearErrors<FieldValues>;
	setAddressValid?: any;
	setDataGooglePlaceSelected: React.Dispatch<
		React.SetStateAction<google.maps.places.PlaceResult | undefined>
	>;
}
let validCountry: boolean = false;

const GooglePlaceAPI: React.FC<PropsGooglePlaceAPI> = ({
	tokenGoogleAPI,
	restrictionsCountries,
	register,
	rules,
	errors,
	setValue,
	watch,
	className,
	setError,
	setDataGooglePlaceSelected,
	clearErrors,
	setAddressValid,
}) => {
	const URL_GOOGLE_API = `https://maps.googleapis.com/maps/api/js?key=${tokenGoogleAPI}&libraries=places`;

	const { onLoadGooglePlaceAPI, setOnLoadGooglePlaceAPI } = React.useContext(
		GooglePlaceAPIContext
	);

	const onLoadGooglePlaces = () => {
		const input = document.getElementById('pac-input') as HTMLInputElement;

		const options = {
			componentRestrictions: { country: restrictionsCountries || [] },
			fields: [
				'address_components',
				'geometry',
				'icon',
				'name',
				'formatted_address',
			],
			strictBounds: false,
			types: ['geocode'],
		};
		const autocomplete = new google.maps.places.Autocomplete(input, options);
		autocomplete.setTypes(options.types);
		// Set initial restriction to the greater list of countries.
		// autocomplete.setComponentRestrictions({
		// 	country: ['us'],
		// });

		const southwest = { lat: 5.6108, lng: 136.589326 };
		const northeast = { lat: 61.179287, lng: 2.64325 };
		const newBounds = new google.maps.LatLngBounds(southwest, northeast);

		autocomplete.setBounds(newBounds);

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			validCountry = true;
			setDataGooglePlaceSelected(place);
			setAddressValid(true);
			// setError('location', {});
			clearErrors('address');
			if (!place.geometry || !place.geometry.location) {
				// User entered the name of a Place that was not suggested and
				// pressed the Enter key, or the Place Details request failed.
				// window.alert("No details available for input: '" + place.name + "'");
				// return;
			}

			setValue('address', place.formatted_address, { shouldValidate: true });
			// let address = '';
			console.log(place.formatted_address);
			if (place.address_components) {
				// address = [
				// 	(place.address_components[0] &&
				// 		place.address_components[0].short_name) ||
				// 		'',
				// 	(place.address_components[1] &&
				// 		place.address_components[1].short_name) ||
				// 		'',
				// 	(place.address_components[2] &&
				// 		place.address_components[2].short_name) ||
				// 		'',
				// ].join(' ');
			}
		});
	};

	React.useEffect(() => {
		if (onLoadGooglePlaceAPI) {
			onLoadGooglePlaces();
		}
		return () => {
			// window.removeEventListener('place_changed', () => {
			// 	console.log('listo');
			// });
		};
	}, [onLoadGooglePlaceAPI]);

	// const onChange = () => {
	// 	setTimeout(() => {
	// 		console.log('error');
	// 		if (!validCountry) {
	// 			setError('address', {
	// 				type: 'manual',
	// 				message: 'You must select a valid address',
	// 			});
	// 			setAddressValid(false);
	// 		}

	// 		validCountry = false;
	// 	}, 500);
	// };

	const onChangeCustom = () => {
		setTimeout(() => {
			if (!validCountry) {
				setError('address', {
					type: 'manual',
					message: 'You must select a valid address',
				});
				setAddressValid(false);
			}
			validCountry = false;
		}, 500);
		// if (!placeValid) {
		// 	setError('location', {
		// 		type: 'manual',
		// 		message: 'You must select a valid address',
		// 	});
		// }
		// if (placeValid) {
		// 	setError('location', {});
		// 	setPlaceValid(false);
		// }
		// var addr = document.getElementById('pac-input') as any;
		// // Get geocoder instance
		// var geocoder = new google.maps.Geocoder();

		// // Geocode the address
		// geocoder.geocode(
		// 	{
		// 		address: addr.value,
		// 	},
		// 	function (results: any, status) {
		// 		console.log('eleee:', status);
		// 		console.log('resu:', results);
		// 		if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
		// 			// set it to the correct, formatted address if it's valid
		// 			// addr.value = results[0].formatted_address;
		// 		} else {
		// 			// show an error if it's not
		// 			alert('Invalid address');
		// 		}
		// 	}
		// );
	};

	const onFocusOut = () => {
		setTimeout(() => {
			if (!validCountry) {
				setError('address', {
					type: 'manual',
					message: 'You must select a valid address',
				});
				setAddressValid(false);
			}
		}, 500);
		// if (!placeValid) {
		// 	setError('location', {
		// 		type: 'manual',
		// 		message: 'You must select a valid address',
		// 	});
		// }
		// if (placeValid) {
		// 	setError('location', {});
		// 	setPlaceValid(false);
		// }
		// var addr = document.getElementById('pac-input') as any;
		// // Get geocoder instance
		// var geocoder = new google.maps.Geocoder();

		// // Geocode the address
		// geocoder.geocode(
		// 	{
		// 		address: addr.value,
		// 	},
		// 	function (results: any, status) {
		// 		console.log('eleee:', status);
		// 		console.log('resu:', results);
		// 		if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
		// 			// set it to the correct, formatted address if it's valid
		// 			// addr.value = results[0].formatted_address;
		// 		} else {
		// 			// show an error if it's not
		// 			alert('Invalid address');
		// 		}
		// 	}
		// );
	};

	return (
		<>
			<Script
				src={URL_GOOGLE_API}
				onLoad={() => {
					setOnLoadGooglePlaceAPI(true);
				}}
			/>
			<Input
				register={register}
				id="pac-input"
				name="address"
				placeholder="Address"
				rules={rules}
				error={errors}
				isFill={watch}
				className={className}
				// onChangeCustom={onChangeCustom}
				onChangeCustom={onChangeCustom}
				onBlur={onFocusOut}
				// onChangeCustom={onChange}
				// colorErrorHide
			/>
		</>
	);
};

export default GooglePlaceAPI;
