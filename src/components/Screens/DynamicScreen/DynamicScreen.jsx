import React from 'react';
import { useTranslation } from 'react-i18next';
// import errorBG from '../../../img/back1.webp';
// import maintenanceBG from '../../../img/back2.webp';
// import comingSoonBG from '../../../img/back3.webp';
import './DynamicScreen.scss'; // Import the CSS file for styling

const DynamicScreen = ({ variant }) => {
	const { t } = useTranslation();

	// Define the different backgrounds and texts
	const variants = {
		error: {
			// backgroundImage: `url(${errorBG})`,
			text: `${t('error404')}`,
			style: {
				// background: `url(${errorBG}) no-repeat center center/cover`,
			},
		},
		maintenance: {
			// backgroundImage: `url(${maintenanceBG})`,
			text: `${t('repairUpdate')}`,
			style: {
				// background: `url(${maintenanceBG}) no-repeat center center/cover`,
			},
		},
		comingSoon: {
			// backgroundImage: `url(${comingSoonBG})`,
			text: `${t('comingSoon')}`,
			style: {
				// background: `url(${comingSoonBG}) no-repeat center center/cover`,
			},
		},
	};

	// Default to error variant if an unknown variant is passed
	const { text, style } = variants[variant] || variants.error;

	return (
		<div className='component-container' style={style}>
			<div className='componentText'>
				<h4>{text}</h4>
			</div>
		</div>
	);
};

export default DynamicScreen;
