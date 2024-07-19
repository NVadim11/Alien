import React from 'react';
import preloaderBG from '../../../img/back2.webp';
import QRimg from '../../../img/tigranQR.webp';
import './QRcode.scss'; // Import the CSS file for styling

const TelegramLinking = () => {
	return (
		<div
			className='qrComponent'
			style={{
				background: `url(${preloaderBG}) no-repeat center center/cover`,
			}}
		>
			<div
				style={{
					display: 'flex',
					scale: '100%',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<img
					src={QRimg}
					alt='QR redirect'
					style={{
						width: '300px',
						borderRadius: '20px',
					}}
				/>
			</div>
			<div className='qrComponentText'>
				<h4>
					{' '}
					Leave the desktop. <br />
					Mobile gaming rocks!
				</h4>
			</div>
		</div>
	);
};

export default TelegramLinking;
