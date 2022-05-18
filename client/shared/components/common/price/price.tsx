import * as React from 'react';

interface PriceProps {
	price: number;
}

const Price: React.FC<PriceProps> = ({ price }) => {
	const [priceFixed, setPriceFixed] = React.useState('');
	React.useEffect(() => {
		let newPrice = '';
		let j = 0;
		for (let i = price.toString().length - 1; i >= 0; i--) {
			if (i !== price.toString().length - 1 && i % 3 === 2) {
				newPrice += ',';
			}
			newPrice += price.toString()[j];
			j++;
		}
		setPriceFixed(newPrice);
	}, [price]);
	return <>{priceFixed}</>;
};

export default Price;
