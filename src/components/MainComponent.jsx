import AOS from 'aos';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { useGetUserByTgIdQuery } from '../services/phpService';

import avatar from '../img/avatar.webp';
import back1 from '../img/back1.webp';
import back2 from '../img/back2.webp';
import back3 from '../img/back3.webp';
import bgMob from '../img/background_mobile.webp';
import energy from '../img/energy.webp';
import leaderboard from '../img/leaderboard.webp';
import referral from '../img/referral.webp';
import tiger1 from '../img/tiger1.webp';
import tiger_ava from '../img/tiger_ava.webp';
import boostCoin from '../img/tigranBoost.webp';
import tigranCash from '../img/tigranCash-optimize.gif';
import tigranChill from '../img/tigranChill-optimize.gif';
import tigranGold from '../img/tigranGold-optimize.gif';
import tigranIdle from '../img/tigranIdle-optimize.gif';
import tigranMachine from '../img/tigranMachine-optimize.gif';
import tigranQR from '../img/tigranQR.webp';
import tigranTalk from '../img/tigranTalk-optimize.gif';
import tigranCircle from '../img/tigran_circle.webp';

import Footer from './Footer/Footer';
import Header from './Header/Header';
import MainContent from './MainContent/MainContent';
import Preloader from './Preloader/Preloader';
import DynamicScreen from './Screens/DynamicScreen/DynamicScreen';
import TelegramLinking from './Screens/QRcode/QRcode';

const MainComponent = () => {
	const tg = window.Telegram.WebApp;
	const initData = tg.initDataUnsafe;
	const userId = initData?.user?.id;
	const [skip, setSkip] = useState(true);
	const { data: user } = useGetUserByTgIdQuery(userId, {
		skip: skip,
		pollingInterval: 10000,
	});
	const [preloaderLoaded, setPreloaderLoaded] = useState(false);
	const imagesRef = useRef([]);

	const secretURL = process.env.REACT_APP_REGISTER_KEY;
	const testURL = process.env.REACT_APP_TEST_URL;

	useEffect(() => {
		const registerUser = async () => {
			try {
				const body = {
					query_id: initData?.query_id,
					user: {
						id: initData?.user.id,
						is_bot: initData?.user.is_bot,
						is_premium: initData?.user.is_premium,
						first_name: initData?.user.first_name,
						last_name: initData?.user.last_name,
						username: initData?.user.username,
						language_code: initData?.user.language_code,
					},
					auth_date: initData?.auth_date,
					hash: initData?.hash,
					timezone: moment.tz.guess(), // Automatically get the user's timezone
				};

				// Conditionally add parent_id_telegram
				if (initData?.start_param) {
					body.parent_id_telegram = initData.start_param;
				}

				const response = await fetch(`${secretURL}/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const data = await response.json();
			} catch (error) {
				console.error('Error:', error);
			}
		};

		if (!user) {
			registerUser();
		} else {
			console.log('No user data available');
		}
	}, [initData, user, secretURL]);

	useEffect(() => {
		const loadImage = (src) => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
			});
		};

		const imageSources = [
			avatar,
			back1,
			back2,
			back3,
			bgMob,
			energy,
			leaderboard,
			referral,
			tiger_ava,
			tiger1,
			tigranCircle,
			tigranCash,
			tigranChill,
			tigranGold,
			tigranQR,
			boostCoin,
			tigranIdle,
			tigranMachine,
			tigranTalk,
		];

		const loadImages = async () => {
			const promises = imageSources.map((src) => loadImage(src));

			try {
				const loadedImages = await Promise.all(promises);
				imagesRef.current = loadedImages;
				checkAllLoaded();
			} catch (e) {
				console.log('Problem loading images');
			}
		};

		const checkAllLoaded = () => {
			if (imagesRef.current.length === imageSources.length) {
				if (user) {
					setTimeout(() => {
						setPreloaderLoaded(true);
						AOS.init({
							easing: 'custom',
						});
					}, 500);
				} else {
					console.log('User data is not available.');
				}
			}
		};

		loadImages();
	}, [user]);

	useEffect(() => {
		if (tg && userId) {
			setSkip(false);
		}
	}, [tg, userId]);

	// Detecting if the application is opened from a mobile device
	const isMobileDevice =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);

	// Change the variant based on current state
	// 'error' | 'maintenance' | 'comingSoon'
	const [variant, setVariant] = useState('error');
	useEffect(() => {
		setVariant('error');
	}, []);

	return (
		<>
			<Preloader loaded={preloaderLoaded} />
			{preloaderLoaded && (
				<>
					{!isMobileDevice ? (
						<TelegramLinking />
					) : (
						<>
							{user ? (
								<>
									<Header user={user} />
									<main id='main' className='main'>
										<MainContent user={user} />
									</main>
									<Footer user={user} />
								</>
							) : (
								<DynamicScreen variant={variant} />
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default MainComponent;
