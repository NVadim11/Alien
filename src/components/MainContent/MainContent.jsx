import axios from 'axios';
import bcrypt from 'bcryptjs';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import energy from '../../img/energy.webp';
import boostCoin from '../../img/tigranBoost.webp';
import tigranCash from '../../img/tigranCash-optimize.gif';
import tigranChill from '../../img/tigranChill-optimize.gif';
import tigranGold from '../../img/tigranGold-optimize.gif';
import tigranIdle from '../../img/tigranIdle-optimize.gif';
import tigranMachine from '../../img/tigranMachine-optimize.gif';
import tigranTalk from '../../img/tigranTalk-optimize.gif';
import { useUpdateBalanceMutation } from '../../services/phpService';
import GamePaused from './GamePaused/GamePaused';
import './MainContent.scss';

const MainContent = ({ user }) => {
	const [currCoins, setCurrCoins] = useState(0);
	const [currEnergy, setCurrEnergy] = useState(0); //user?.energy
	const [heroState, setHeroState] = useState(tigranIdle);
	const [heroAnimation, setHeroAnimation] = useState(heroState);
	const coinRef = useRef(null);
	const [updateBalance] = useUpdateBalanceMutation();
	const [position, setPosition] = useState({ x: '0', y: '0' });
	const [boostPhase, setBoostPhase] = useState(false);
	const [visible, setVisible] = useState(false);
	const [tigerVisible, setTigerVisible] = useState(true);
	let [energyVal, setEnergyVal] = useState(1);
	let [clickNewCoins, setClickNewCoins] = useState(1);
	const [gamePaused, setGamePaused] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState('');
	const [isAnimationActive, setIsAnimationActive] = useState(false);
	const [animations, setAnimations] = useState([]);
	const [totalPoints, setTotalPoints] = useState(user?.wallet_balance);
	const accumulatedCoinsRef = useRef(0);
	const [unsubmittedCoins, setUnsubmittedCoins] = useState(0);
	const [isCoinsChanged, setIsCoinsChanged] = useState(false);
	const isCoinsChangedRef = useRef(isCoinsChanged);
	const [resetCoinsCalled, setResetCoinsCalled] = useState(false);
	const maxEnergy = 1000;
	const timeoutRef = useRef(null);
	const tigerImgRef = useRef(null);
	const isMedia = useMediaQuery({ maxWidth: '1439.98px' });

	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;

	const { t } = useTranslation();

	// aws
	const secretKey = process.env.REACT_APP_SECRET_KEY;

	const secretURL = process.env.REACT_APP_SECRET_URL;
	const testURL = process.env.REACT_APP_TEST_URL;

	const isDesktop = () => {
		const userAgent = window.navigator.userAgent;
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		return !isMobile;
	};

	useEffect(() => {
		if (!isDesktop()) {
			const element = document.getElementById('clickableElement');
			if (element) {
				element.style.pointerEvents = 'none';
			}
		}
	}, []);

	const pauseGame = async () => {
		const currentTimeStamp = Math.floor(Date.now() / 1000);
		const futureTimestamp = currentTimeStamp + 60 * 60;
		const now = new Date();
		const options = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'UTC',
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);

		fetch(secretURL + '/api/set-activity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: userId,
				timestamp: futureTimestamp,
			}),
		})
			.then((response) => {
				if (response.ok) {
				} else {
					console.log('Failed to pause game');
				}
			})
			.catch((e) => {
				console.log('Error pausing game');
			});
	};

	useEffect(() => {
		if (user) {
			setTimeout(() => {
				setCurrEnergy(user.energy);
			}, 500);
		}
	}, []);

	useEffect(() => {
		let pauseTimeoutId;

		if (currEnergy >= 1000) {
			setGamePaused(true);
			setTigerVisible(false);

			// Call pauseGame after 3 seconds
			pauseTimeoutId = setTimeout(() => {
				pauseGame();
			}, 1500);
		}

		return () => {
			clearTimeout(pauseTimeoutId);
		};
	}, [currEnergy]);

	const getGameStatus = async () => {
		try {
			const initGameStatusCheck = await axios.get(
				secretURL + `/api/telegram-id/${userId}`
			);
		} catch (e) {
			console.log('Error fetching leaderboard data');
		}
	};

	useEffect(() => {
		if (user) {
			const updateGameStatus = () => {
				// Get the current time in Frankfurt time zone ('Etc/GMT-3')
				const currentTimeStamp = moment.tz('UTC').unix();
				const remainingTime = user?.active_at - currentTimeStamp;
				if (remainingTime >= 0) {
					if (remainingTime <= 0) {
						setGamePaused(false);
						setTigerVisible(true);
					} else {
						setGamePaused(true);
						setTimeRemaining(remainingTime);
					}
				}
			};

			getGameStatus();

			const timeout = setTimeout(() => {
				getGameStatus();
			}, 1000);

			const timer = setInterval(() => {
				updateGameStatus();
			}, 1000);

			return () => {
				clearInterval(timer);
				clearTimeout(timeout);
			};
		}
	}, [userId, user]);

	const boostClickedHandler = () => {
		handleBoostClick();
	};

	const handleBoostClick = () => {
		const prevEnergyVal = energyVal;
		const prevClickNewCoins = clickNewCoins;

		setBoostPhase(true);
		setVisible(false);
		setEnergyVal(4);
		setClickNewCoins(4);

		setTimeout(() => {
			setEnergyVal(prevEnergyVal);
			setClickNewCoins(prevClickNewCoins);
			setBoostPhase(false);
			setVisible(false);
		}, 10000);
	};

	const positions = [
		{ x: 100, y: -250 },
		{ x: 100, y: -200 },
		{ x: 100, y: -150 },
		{ x: 100, y: -100 },
		{ x: 100, y: -50 },
		{ x: 100, y: 0 },
		{ x: -50, y: -250 },
		{ x: -50, y: -200 },
		{ x: -50, y: -150 },
		{ x: -50, y: -100 },
		{ x: -50, y: -50 },
		{ x: -50, y: 0 },
		{ x: 210, y: -250 },
		{ x: 210, y: -200 },
		{ x: 210, y: -150 },
		{ x: 210, y: -100 },
		{ x: 210, y: -50 },
		{ x: 210, y: 0 },
	];

	const randomizePosition = () => {
		const randomIndex = Math.floor(Math.random() * positions.length);
		const { x, y } = positions[randomIndex];
		setPosition({ x, y });
	};

	useEffect(() => {
		if (gamePaused) {
			setBoostPhase(false);
			setVisible(false);
			setBoostPhase(false);
			clearAnimations();
			setEnergyVal(1);
			setClickNewCoins(1);
		}
	}, [gamePaused]);

	useEffect(() => {
		let showBoostTimeout;
		let hideBoostTimeout;

		if (!gamePaused) {
			if (!visible) {
				randomizePosition();
				showBoostTimeout = setTimeout(() => {
					randomizePosition();
					setVisible(true);
				}, 30000);
			} else {
				hideBoostTimeout = setTimeout(() => {
					setVisible(false);
				}, 7000);
			}
		}

		return () => {
			clearTimeout(showBoostTimeout);
			clearTimeout(hideBoostTimeout);
		};
	}, [visible, gamePaused]);

	useEffect(() => {
		if (currEnergy <= 0) {
			setCurrEnergy(0);
		}
	}, [currEnergy]);

	const updateCurrCoins = () => {
		if (currEnergy >= 0 && currEnergy <= 150) {
			setHeroState(tigranIdle);
		} else if (currEnergy >= 151 && currEnergy <= 300) {
			setHeroState(tigranTalk);
		} else if (currEnergy >= 301 && currEnergy <= 550 && !resetCoinsCalled) {
			setResetCoinsCalled(true); // Set the state to true
			resetCoins(); // Call resetCoins only once
			setHeroState(tigranCash);
		} else if (currEnergy >= 551 && currEnergy <= 800) {
			setHeroState(tigranChill);
		} else if (currEnergy >= 801 && currEnergy <= 1000) {
			setHeroState(tigranMachine);
		}
		setHeroAnimation(heroState);
		setIsCoinsChanged(true);
		resetTimeout();

		return clickNewCoins;
	};

	const resetCoins = () => {
		const coinsToSubmit = accumulatedCoinsRef.current + unsubmittedCoins;
		submitData(coinsToSubmit);
		accumulatedCoinsRef.current = 0;
		setUnsubmittedCoins(0);
	};

	const resetTimeout = () => {
		setIsCoinsChanged(false);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			const coinsToSubmit = accumulatedCoinsRef.current + unsubmittedCoins;
			submitData(coinsToSubmit);

			accumulatedCoinsRef.current = 0;
			setUnsubmittedCoins(0);
		}, 1000);
	};

	useEffect(() => {
		isCoinsChangedRef.current = isCoinsChanged;
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isCoinsChanged]);

	const submitData = async (coins) => {
		const now = new Date();
		const options = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'UTC',
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);
		try {
			await updateBalance({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				score: coins,
			}).unwrap();
		} catch (e) {
			console.log('Error submitting coins:', e);
			// If there's an error, add the coins back to unsubmittedCoins
			setUnsubmittedCoins((prev) => prev + coins);
		}
	};

	const handleShowAnimation = (event) => {
		if (!event) return;

		const touch = event.touches ? event.touches[0] : event;
		const clicker = event.currentTarget || touch.target;
		if (!clicker) return;
		const x = touch.pageX;
		const y = touch.pageY;

		setAnimations((prev) => [...prev, { x, y }]);
		setIsAnimationActive(true);
	};

	const handleTouchStart = (event) => {
		if (event.touches) {
			Array.from(event.touches).forEach((touch) => {
				const clicker = event.currentTarget || touch.target;
				if (!clicker) return;
				const x = touch.pageX;
				const y = touch.pageY;
				handleShowAnimation({
					touches: [touch],
					target: event.target,
					currentTarget: event.currentTarget,
				});
			});
		} else {
			const clicker = event.currentTarget || event.target;
			if (!clicker) return;
			const x = event.pageX;
			const y = event.pageY;
			handleShowAnimation(event);
		}
	};

	const handleTouchEnd = () => {
		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
		setCurrEnergy((prevEnergy) => Math.min(prevEnergy + energyVal, 1000));
	};

	const clearAnimations = () => {
		setAnimations([]);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (Object.keys(user).length) {
				setTotalPoints(user?.wallet_balance);
			}
		};

		if (user) {
			fetchData();
		}
	}, [user]);

	return (
		<div className='mainContent'>
			<div className='mainContent__gameContent'>
				<div className='mainContent__gameContentBox'>
					{gamePaused ? (
						<GamePaused user={user} remainingTime={timeRemaining} />
					) : (
						<>
							{tigerVisible && (
								<>
									{!gamePaused && visible ? (
										<motion.div
											initial={{
												y: 7,
												rotate: 0,
												opacity: 1,
											}}
											animate={{
												y: [0, -10, 0],
												rotate: [0, 3, -7, 0],
											}}
											transition={{
												duration: 4,
												repeat: Infinity,
												repeatType: 'mirror',
												ease: 'easeInOut',
											}}
											style={{
												position: 'absolute',
												top: '50%',
												left: 0,
												zIndex: 25,
											}}
										>
											<motion.div
												animate={{
													opacity: [0, 1],
												}}
												transition={{
													duration: 4,
													repeat: Infinity,
													repeatType: 'mirror',
													ease: 'easeInOut',
												}}
											>
												<div
													className='boost-element'
													style={{
														position: 'absolute',
														overflow: 'hidden',
														left: `${position.x}px`,
														top: `${position.y}px`,
														cursor: 'pointer',
														width: '150px',
														height: '150px',
														zIndex: 25,
														...(isMedia && {
															scale: '80%',
														}),
													}}
													onClick={boostClickedHandler}
												>
													<motion.img
														src={boostCoin}
														alt='Boost coin'
														style={{
															width: '100%',
															height: '100%',
															userSelect: 'none',
															scale: '100%',
														}}
														initial={{ opacity: 0, rotate: 0 }}
														animate={{ opacity: 1, rotate: 360 }}
														transition={{
															duration: 4,
															repeat: Infinity,
															repeatType: 'mirror',
															ease: 'easeInOut',
														}}
													/>
												</div>
											</motion.div>
										</motion.div>
									) : null}
									<div className='mainContent__header'>
										<div className='mainContent__totalCoins'>
											<div className='mainContent__totalCoinsBox'>
												<div className='mainContent__totalCoinsImg' draggable='false'>
													<img src={boostCoin} draggable='false' />
												</div>
												{user && totalPoints !== null && (
													<div className='mainContent__totalCoinsAmount'>
														<span>{totalPoints}</span>
													</div>
												)}
											</div>
										</div>
										{!gamePaused && (
											<div className='mainContent__energyContainer'>
												<div className='mainContent__energyValue'>
													<img src={energy} alt='' />
													<p className='energyCount' id='energyCount'>
														{currEnergy}
													</p>
													<span>/</span>
													<p className='maximumEnergy' id='maximumEnergy'>
														{maxEnergy}
													</p>
												</div>
												<div className='mainContent__energyBar'>
													<progress
														className='filledBar'
														id='filledBar'
														max='1000'
														value={currEnergy}
													></progress>
												</div>
											</div>
										)}
									</div>
									<div
										className='mainContent__clickArea'
										onTouchStart={handleTouchStart}
										onTouchEnd={(e) => handleTouchEnd(e.touches[0], e)}
									>
										{animations.map((anim, index) => (
											<AnimatePresence key={index}>
												{isAnimationActive && (
													<motion.div
														className='clickerAnimation'
														initial={{ opacity: 1, y: 0 }}
														animate={{ opacity: [1, 0], y: [-90, -240] }}
														exit={{ opacity: 0 }}
														transition={{ duration: 1.5 }}
														style={{
															color: '#000',
															fontSize: '34px',
															left: `${anim.x}px`,
															top: `${anim.y}px`,
															position: 'absolute',
															color: boostPhase ? '#FFDA17' : '#333333',
															zIndex: 10,
															fontFamily: 'Bebas',
															textShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)',
														}}
														onAnimationComplete={() => {
															clearAnimations(index);
														}}
													>
														+{clickNewCoins}
													</motion.div>
												)}
											</AnimatePresence>
										))}
										<div className='mainContent__imageContainer'>
											<img
												src={boostPhase ? tigranGold : heroAnimation}
												draggable='false'
												alt='Tiger idle'
											/>
										</div>
									</div>
									<div className='mainContent__footer'>
										{!gamePaused && (
											<div className='mainContent__sessionCoins'>
												<div className='mainContent__sessionCoins-img' draggable='false'>
													<img src={boostCoin} draggable='false' />
												</div>
												<div className='mainContent__sessionCoins-text'>
													<span>{t('mainSessionCoins')}</span>
													<div className='blackLine'></div>
													<div className='mainContent__sessionCoins-coins'>
														{currCoins}
													</div>
												</div>
											</div>
										)}
										{!gamePaused && (
											<div className='mainContent__energyHint'>
												<p>{t('mainEnergyHint')}</p>
											</div>
										)}
									</div>
								</>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default MainContent;
