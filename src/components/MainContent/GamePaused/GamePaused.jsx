import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import tigranChill from '../../../img/tigranChill-optimize.gif';
import tigranCircle from '../../../img/tigran_circle.webp';

const GamePaused = ({ user, remainingTime }) => {
	const [timeRemaining, setTimeRemaining] = useState(remainingTime);
	const { t } = useTranslation();

	useEffect(() => {
		setTimeRemaining(remainingTime);
	}, [remainingTime]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}`;
	};

	return (
		<div className='mainContent__gamePaused'>
			<div className='mainContent__totalCoins'>
				<div className='mainContent__totalCoinsBox'>
					<div className='mainContent__totalCoinsImg' draggable='false'>
						<img src={tigranCircle} draggable='false' />
					</div>
					{user !== null && (
						<div className='mainContent__totalCoinsAmount'>
							<span>{user?.wallet_balance}</span>
						</div>
					)}
				</div>
			</div>
			{timeRemaining ? (
				<h4 style={{ marginBottom: '10px', marginTop: '20px' }}>
					{t('gamePauseTitle')} {formatTime(timeRemaining)} {t('gamePauseMinutes')}
				</h4>
			) : (
				<h4 style={{ marginBottom: '10px', marginTop: '20px' }}>{t('gamePauseCalc')}</h4>
			)}
			<div className='mainContent__imageContainer'>
				<img src={tigranChill} draggable='false' alt='Tiger Chill' />
			</div>
			<p style={{ marginTop: '20px' }}>{t('gamePauseDescr')}</p>
		</div>
	);
};

export default GamePaused;
