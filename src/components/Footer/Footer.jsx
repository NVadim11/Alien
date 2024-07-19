import bcrypt from 'bcryptjs';
import React, { useEffect, useState } from 'react';
import {
	useChangeWalletMutation,
	usePassDailyMutation,
	usePassPartnersMutation,
	usePassTaskMutation,
	useSetWalletMutation,
} from '../../services/phpService';

import { useTonAddress, TonConnectButton } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';
import cross from '../../img/cross.svg';
import boostCoin from '../../img/alienBoost.webp';
import Modal from '../Modal/Modal';
import './Footer.scss';
import { init } from 'aos';

const Footer = ({ user }) => {
	const tg = window.Telegram.WebApp;
	const [tasksOpen, setTasksOpen] = useState(false);
	const [passTask] = usePassTaskMutation();
	const [setWallet] = useSetWalletMutation();
	const [changeWallet] = useChangeWalletMutation();
	const [activeTab, setActiveTab] = useState(0);
	const [passDaily] = usePassDailyMutation();
	const [passPartners] = usePassPartnersMutation();
	const [hasWalletAddress, setHasWalletAddress] = useState(false);

	const { t } = useTranslation();
	const initLanguage = localStorage.getItem('language');
	const [currLanguage, setCurrLanguage] = useState(initLanguage);

	const dailyTasksObj = user?.daily_quests;
	const partnerTaskObj = user?.partners_quests;
	const [dailyQuests, setDailyQuests] = useState(dailyTasksObj);
	const [partnerQuests, setPartnerQuests] = useState(partnerTaskObj);

	// Modal logic
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalType, setModalType] = useState('green'); // Default modal type
	const [buttonText, setButtonText] = useState('');

	// Fake timer
	const [twitterTaskStatus, setTwitterTaskStatus] = useState(user?.twitter || 0);
	const [chatTaskStatus, setChatTaskStatus] = useState(user?.tg_chat || 0);
	const [channelTaskStatus, setСhannelTaskStatus] = useState(user?.tg_channel || 0);
	const [websiteTaskStatus, setWebsiteTaskStatus] = useState(user?.website || 0);
	const [timerTwitter, setTwitterTimer] = useState(0);
	const [timerChat, setChatTimer] = useState(0);
	const [timerChannel, setChannelTimer] = useState(0);
	const [timerWebsite, setWebsiteTimer] = useState(0);

	const ton_address = useTonAddress(true);

	const openModal = (type, text, btnText) => {
		setModalType(type);
		setModalText(text);
		setButtonText(btnText);
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.remove('show-blur');
	};

	// aws
	const secretKey = process.env.REACT_APP_SECRET_KEY;

	useEffect(() => {
		if (user) {
			setTwitterTaskStatus(user.twitter || 0);
			setChatTaskStatus(user.tg_chat || 0);
			setСhannelTaskStatus(user.tg_channel || 0);
			setWebsiteTaskStatus(user.website || 0);
			setPartnerQuests(partnerTaskObj);
			setDailyQuests(dailyTasksObj);
		}
	}, [user]);

	const popupTasksTgl = tasksOpen ? 'popupTasks_show' : null;
	const popupTasks = `popupTasks ${popupTasksTgl}`;

	const handleTabClick = (index) => {
		setActiveTab(index);
	};

	const options = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'UTC',
	};
	const now = new Date();
	const dateStringWithTime = now.toLocaleString('en-GB', options);

	const tasksBtn = () => {
		fadeShow();
		setTimeout(() => {
			setTasksOpen(true);
		}, 250);
	};

	const fadeShow = () => {
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.add('popupTasks-show');
		if (headerTag) headerTag.classList.add('show-blur');
		if (mainTag) mainTag.classList.add('show-blur');
		if (footerTag) footerTag.classList.add('show-blur');
		if (bgTag) bgTag.classList.add('h100');
	};

	const tasksCloseToggler = () => {
		setTasksOpen(false);
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.remove('popupTasks-show');
		if (headerTag) headerTag.classList.remove('show-blur');
		if (mainTag) mainTag.classList.remove('show-blur');
		if (footerTag) footerTag.classList.remove('show-blur');
		if (bgTag) bgTag.classList.remove('h100');
	};

	const submitWallet = async () => {
		if (ton_address) {
			try {
				const res = await setWallet({
					token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
					wallet_address: ton_address,
					id_telegram: user?.id_telegram,
				}).unwrap();
			} catch (e) {
				console.log(e);
			}
		}
	};

	const updateWallet = async () => {
		if (ton_address) {
			try {
				const res = await changeWallet({
					token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
					wallet_address: ton_address,
					user_id: user?.id,
				}).unwrap();
			} catch (e) {
				console.log(e);
			}
		}
	};

	useEffect(() => {
		const handleWalletLogic = async () => {
			if (ton_address) {
				if (user?.wallet_address === null) {
					await submitWallet();
				} else if (
					user?.wallet_address !== null &&
					ton_address !== user?.wallet_address
				) {
					await updateWallet();
				}
			}
		};

		handleWalletLogic();
	}, [ton_address, user]);

	const blurPopupTasks = () => {
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.add('show-blur');
		const footerTag = document.getElementById('footer');
		if (footerTag) footerTag.classList.add('show-blur');
	};

	const passDailyHandler = async (taskId, link) => {
		if (link !== null) {
			window.open(link, '_blank');
		}
		try {
			await passDaily({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				user_id: user?.id,
				daily_quest_id: taskId,
			}).unwrap();

			const res = { success: true };

			if (res.success) {
				// Update quest status to completed (status: 1)
				updateDailyQStatus(taskId, 1);
				openModal('green', `${t('modalSuccess')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			} else {
				openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			}
		} catch (e) {
			openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
			blurPopupTasks();
		}
	};

	const updateDailyQStatus = (taskId, status) => {
		// Update the quest status in state
		setDailyQuests((prevQuests) =>
			prevQuests.map((quest) =>
				quest.id === taskId ? { ...quest, status: status } : quest
			)
		);
	};

	const partnersTaskHandler = async (taskId, link) => {
		if (link !== null) {
			window.open(link, '_blank');
		}
		try {
			await passPartners({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				user_id: user?.id,
				partners_quest_id: taskId,
			}).unwrap();

			const res = { success: true };

			if (res.success) {
				// Update quest status to completed (status: 1)
				updatePartnerQStatus(taskId, 1);
				openModal('green', `${t('modalSuccess')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			} else {
				openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			}
		} catch (e) {
			openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
			blurPopupTasks();
		}
	};

	const updatePartnerQStatus = (taskId, status) => {
		// Update the quest status in state
		setPartnerQuests((prevQuests) =>
			prevQuests.map((quest) =>
				quest.id === taskId ? { ...quest, status: status } : quest
			)
		);
	};

	const twitterClick = async () => {
		window.open('https://x.com/tema_cash', '_blank');

		if (twitterTaskStatus === 0) {
			setTwitterTimer(15);
			setTwitterTaskStatus(2);
		}
	};

	const tgClickChat = async () => {
		window.open('https://t.me/Tiger_Cash_Chat', '_blank');

		if (chatTaskStatus === 0) {
			setChatTimer(15);
			setChatTaskStatus(2);
		}
	};

	const tgClickChannel = async () => {
		let url;
		if (initLanguage === 'ru') {
			url = 'https://t.me/TigerCash_ru';
		} else if (initLanguage === 'en') {
			url = 'https://t.me/TigerCashChannel';
		}
		window.open(url, '_blank');

		if (channelTaskStatus === 0) {
			setChannelTimer(15);
			setСhannelTaskStatus(2);
		}
	};

	const websiteClick = async () => {
		window.open('https://tema.cash/', '_blank');

		if (websiteTaskStatus === 0) {
			setWebsiteTimer(15);
			setWebsiteTaskStatus(2);
		}
	};

	const claimTwitter = async () => {
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'twitter',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				setTwitterTaskStatus(1);
				openModal('green', `${t('modalSuccess')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			} else {
				console.log('Error completing task');
				openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			}
		} catch (e) {
			console.log(e);
			openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
			blurPopupTasks();
		}
	};

	const claimChat = async () => {
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'tg_chat',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				setChatTaskStatus(1);
				openModal('green', `${t('modalSuccess')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			} else {
				console.log('Error completing task');
				openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			}
		} catch (e) {
			console.log(e);
			openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
			blurPopupTasks();
		}
	};

	const claimChannel = async () => {
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'tg_channel',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				setСhannelTaskStatus(1);
				openModal('green', `${t('modalSuccess')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			} else {
				openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			}
		} catch (e) {
			console.log(e);
			openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
			blurPopupTasks();
		}
	};

	const claimWebsite = async () => {
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'website',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				setWebsiteTaskStatus(1);
				openModal('green', `${t('modalSuccess')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			} else {
				console.log('Error completing task');
				openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
				blurPopupTasks();
			}
		} catch (e) {
			console.log(e);
			openModal('red', `${t('modalError')}`, `${t('modalReturn')}`);
			blurPopupTasks();
		}
	};

	useEffect(() => {
		let timerInterval;
		if (timerTwitter > 0) {
			timerInterval = setInterval(() => {
				setTwitterTimer((prev) => prev - 1);
			}, 1000);
		} else if (timerTwitter === 0 && twitterTaskStatus === 2) {
			setTwitterTaskStatus(3);
		}
		return () => clearInterval(timerInterval);
	}, [timerTwitter, twitterTaskStatus]);

	useEffect(() => {
		let timerInterval;
		if (timerChat > 0) {
			timerInterval = setInterval(() => {
				setChatTimer((prev) => prev - 1);
			}, 1000);
		} else if (timerChat === 0 && chatTaskStatus === 2) {
			setChatTaskStatus(3);
		}
		return () => clearInterval(timerInterval);
	}, [timerChat, chatTaskStatus]);

	useEffect(() => {
		let timerInterval;
		if (timerChannel > 0) {
			timerInterval = setInterval(() => {
				setChannelTimer((prev) => prev - 1);
			}, 1000);
		} else if (timerChannel === 0 && channelTaskStatus === 2) {
			setСhannelTaskStatus(3);
		}
		return () => clearInterval(timerInterval);
	}, [timerChannel, channelTaskStatus]);

	useEffect(() => {
		let timerInterval;
		if (timerWebsite > 0) {
			timerInterval = setInterval(() => {
				setWebsiteTimer((prev) => prev - 1);
			}, 1000);
		} else if (timerWebsite === 0 && websiteTaskStatus === 2) {
			setWebsiteTaskStatus(3);
		}
		return () => clearInterval(timerInterval);
	}, [timerWebsite, websiteTaskStatus]);

	useEffect(() => {
		if (user?.wallet_address) {
			setHasWalletAddress(true);
		}
	}, [user]);

	useEffect(() => {
		setCurrLanguage(initLanguage);
	}, [initLanguage]);

	return (
		<>
			<footer id='footer' className='footerMain'>
				<div className='footerMain__container'>
					<div className='footerMain__activities'>
						<div className='footerMain__activitiesBtn'>
							<button onClick={tasksBtn}>
								<svg
									width='21'
									height='20'
									viewBox='0 0 21 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clipPath='url(#clip0_603_983)'>
										<path
											d='M15.024 0H6.64398C3.00398 0 0.833984 2.17 0.833984 5.81V14.19C0.833984 17.83 3.00398 20 6.64398 20H15.024C18.664 20 20.834 17.83 20.834 14.19V5.81C20.834 2.17 18.664 0 15.024 0ZM8.80398 12.9L6.55398 15.15C6.40398 15.3 6.21398 15.37 6.02398 15.37C5.83398 15.37 5.63398 15.3 5.49398 15.15L4.74398 14.4C4.44398 14.11 4.44398 13.63 4.74398 13.34C5.03398 13.05 5.50398 13.05 5.80398 13.34L6.02398 13.56L7.74398 11.84C8.03398 11.55 8.50398 11.55 8.80398 11.84C9.09398 12.13 9.09398 12.61 8.80398 12.9ZM8.80398 5.9L6.55398 8.15C6.40398 8.3 6.21398 8.37 6.02398 8.37C5.83398 8.37 5.63398 8.3 5.49398 8.15L4.74398 7.4C4.44398 7.11 4.44398 6.63 4.74398 6.34C5.03398 6.05 5.50398 6.05 5.80398 6.34L6.02398 6.56L7.74398 4.84C8.03398 4.55 8.50398 4.55 8.80398 4.84C9.09398 5.13 9.09398 5.61 8.80398 5.9ZM16.394 14.62H11.144C10.734 14.62 10.394 14.28 10.394 13.87C10.394 13.46 10.734 13.12 11.144 13.12H16.394C16.814 13.12 17.144 13.46 17.144 13.87C17.144 14.28 16.814 14.62 16.394 14.62ZM16.394 7.62H11.144C10.734 7.62 10.394 7.28 10.394 6.87C10.394 6.46 10.734 6.12 11.144 6.12H16.394C16.814 6.12 17.144 6.46 17.144 6.87C17.144 7.28 16.814 7.62 16.394 7.62Z'
											fill='white'
										/>
									</g>
									<defs>
										<clipPath id='clip0_603_983'>
											<rect
												width='20'
												height='20'
												fill='white'
												transform='translate(0.833984)'
											/>
										</clipPath>
									</defs>
								</svg>
								<span>{t('tasksTabTitle')}</span>
							</button>
						</div>
						{/* <div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								<span>Coming soon</span>
							</button>
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								<span>Coming soon</span>
							</button>
						</div> */}
					</div>
				</div>
			</footer>
			{tasksOpen && (
				<div id='popupTasks' aria-hidden='true' className={popupTasks}>
					<div className='popupTasks__wrapper'>
						<div className='popupTasks__content'>
							<div className='popupTasks__title'>
								<h4>{t('tasksTitle')}</h4>
								<button
									onClick={tasksCloseToggler}
									type='button'
									className='popupTasks__close'
								>
									<img src={cross} />
								</button>
							</div>
							<div className='popupTasks__coins'>
								<div className='popupTasks__coinBox'>
									{user?.wallet_balance && (
										<>
											<div className='popupTasks__coinImg' draggable='false'>
												<img src={boostCoin} alt='Tiger coin' />
											</div>
											<div className='popupTasks__coinAmount'>
												<span id='coinAmount'>{user?.wallet_balance}</span>
											</div>
										</>
									)}
								</div>
							</div>
							<div className='popupTasks__tabs-btns'>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 0 ? 'active' : ''}`}
									onClick={() => handleTabClick(0)}
								>
									<button>{t('tasksTabSocial')}</button>
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 1 ? 'active' : ''}`}
									onClick={
										user?.wallet_address
											? () => handleTabClick(1)
											: () => {
													openModal(
														'yellow',
														`${t('modalAttention')}`,
														`${t('modalReturn')}`
													);
													blurPopupTasks();
											  }
									}
								>
									<button>{t('tasksTabDaily')}</button>
									{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 2 ? 'active' : ''}`}
									onClick={
										user?.wallet_address
											? () => handleTabClick(2)
											: () => {
													openModal(
														'yellow',
														`${t('modalAttention')}`,
														`${t('modalReturn')}`
													);
													blurPopupTasks();
											  }
									}
								>
									<button>{t('tasksTabPartners')}</button>
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 0 ? 'active' : ''}`}>
								<div className='popupTasks__walletTask'>
									<TonConnectButton
										className='tonconnect-btn'
										style={{ position: 'relative' }}
									/>
									{!user?.wallet_address ? (
										<p>
											20000
											<img src={boostCoin} alt='Tiger coin' />
										</p>
									) : (
										<p>{t('activityDone')}</p>
									)}
								</div>
								<div className='popupTasks__task'>
									<button onClick={twitterClick} disabled={twitterTaskStatus === 1}>
										<span>
											{twitterTaskStatus === 0
												? `${t('followTwitter')}`
												: twitterTaskStatus === 2 || twitterTaskStatus === 3
												? `${t('activityCheck')}`
												: `${t('followTwitter')}`}
										</span>
										{twitterTaskStatus === 0 && (
											<p>
												10000
												<img src={boostCoin} alt='Tiger coin' />
											</p>
										)}
										{twitterTaskStatus === 2 && (
											<p>
												{timerTwitter} {t('taskTimer')}
											</p>
										)}
										{twitterTaskStatus === 1 && <p>{t('activityDone')}</p>}
									</button>
									{twitterTaskStatus === 3 && (
										<div onClick={claimTwitter} className='claim-button'>
											{t('activityClaim')}
										</div>
									)}
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChat} disabled={chatTaskStatus === 1}>
										<span>
											{chatTaskStatus === 0
												? `${t('followTGChat')}`
												: chatTaskStatus === 2 || chatTaskStatus === 3
												? `${t('activityCheck')}`
												: `${t('followTGChat')}`}
										</span>
										{chatTaskStatus === 0 && (
											<p>
												10000
												<img src={boostCoin} alt='Tiger coin' />
											</p>
										)}
										{chatTaskStatus === 2 && (
											<p>
												{timerChat} {t('taskTimer')}
											</p>
										)}
										{chatTaskStatus === 1 && <p>{t('activityDone')}</p>}
									</button>
									{chatTaskStatus === 3 && (
										<div onClick={claimChat} className='claim-button'>
											{t('activityClaim')}
										</div>
									)}
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChannel} disabled={channelTaskStatus === 1}>
										<span>
											{channelTaskStatus === 0
												? `${t('followTGChannel')}`
												: channelTaskStatus === 2 || channelTaskStatus === 3
												? `${t('activityCheck')}`
												: `${t('followTGChannel')}`}
										</span>
										{channelTaskStatus === 0 && (
											<p>
												10000
												<img src={boostCoin} alt='Tiger coin' />
											</p>
										)}
										{channelTaskStatus === 2 && (
											<p>
												{timerChannel} {t('taskTimer')}
											</p>
										)}
										{channelTaskStatus === 1 && <p>{t('activityDone')}</p>}
									</button>
									{channelTaskStatus === 3 && (
										<div onClick={claimChannel} className='claim-button'>
											{t('activityClaim')}
										</div>
									)}
								</div>
								<div className='popupTasks__task'>
									<button onClick={websiteClick} disabled={websiteTaskStatus === 1}>
										<span>
											{websiteTaskStatus === 0
												? `${t('visitWebsite')}`
												: websiteTaskStatus === 2 || websiteTaskStatus === 3
												? `${t('activityCheck')}`
												: `${t('visitWebsite')}`}
										</span>
										{websiteTaskStatus === 0 && (
											<p>
												3000
												<img src={boostCoin} alt='Tiger coin' />
											</p>
										)}
										{websiteTaskStatus === 2 && (
											<p>
												{timerWebsite} {t('taskTimer')}
											</p>
										)}
										{websiteTaskStatus === 1 && <p>{t('activityDone')}</p>}
									</button>
									{websiteTaskStatus === 3 && (
										<div onClick={claimWebsite} className='claim-button'>
											{t('activityClaim')}
										</div>
									)}
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 1 ? 'active' : ''}`}>
								{/* Render quests dynamically based on their status */}
								{dailyQuests && dailyQuests.length > 0 && (
									<>
										{dailyQuests.map((quest) => (
											<div className='popupTasks__task' key={quest.id}>
												{/* Conditionally render button or div */}
												{quest.required_amount === 0 && quest.required_referrals === 0 ? (
													<button
														disabled={quest.status === 1}
														onClick={() =>
															passDailyHandler(quest.id, quest.daily_quest.link)
														}
													>
														<span>
															{currLanguage === 'ru'
																? quest.daily_quest.name_ru
																: quest.daily_quest.name}
														</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																<span
																	style={{
																		alignItems: 'center',
																		background: '#2cb726',
																		border: '1px solid #0d9047',
																		borderRadius: '31px',
																		color: '#ffffff',
																		display: 'flex',
																		justifyContent: 'center',
																		padding: '6px 12px',
																		width: '65%',
																	}}
																>
																	{t('activityClaim')}
																</span>
																{quest.reward}{' '}
																<div className='rewardCoin'>
																	<img src={boostCoin} alt='Tiger coin' />
																</div>
															</p>
														) : (
															<span
																style={{
																	width: 'auto',
																	position: 'absolute',
																	right: '35px',
																}}
															>
																{t('activityDone')}
															</span>
														)}
													</button>
												) : (
													<button
														disabled={quest.status === 1}
														style={
															quest.required_amount > 0 || quest.required_referrals > 0
																? { paddingBottom: '24px' }
																: {}
														}
													>
														<span>
															{currLanguage === 'ru'
																? quest.daily_quest.name_ru
																: quest.daily_quest.name}
														</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																{quest.reward}{' '}
																<div className='rewardCoin'>
																	<img src={boostCoin} alt='Tiger coin' />
																</div>
															</p>
														) : (
															<span
																style={{
																	width: 'auto',
																	position: 'absolute',
																	right: '35px',
																}}
															>
																{t('activityDone')}
															</span>
														)}
													</button>
												)}
												{(quest.required_amount > 0 || quest.required_referrals > 0) && (
													<div className='popupTasks__progressBar'>
														<progress
															max={quest.required_amount || quest.required_referrals}
															value={quest.amount || quest.referrals}
														></progress>
													</div>
												)}
											</div>
										))}
									</>
								)}
							</div>
							<div className={`popupTasks__tasks ${activeTab === 2 ? 'active' : ''}`}>
								{/* Render quests dynamically based on their status */}
								{partnerQuests && partnerQuests.length > 0 && (
									<>
										{partnerQuests
											.filter((quest) => quest.partners_quest.vis === 1)
											.map((quest) => (
												<div className='popupTasks__task'>
													<button
														disabled={quest.status === 1}
														onClick={() =>
															partnersTaskHandler(quest.id, quest.partners_quest.link)
														}
													>
														<span>
															{currLanguage === 'ru'
																? quest.partners_quest.name_ru
																: quest.partners_quest.name}
														</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																{quest.reward}{' '}
																<div className='rewardCoin'>
																	<img src={boostCoin} alt='Tiger coin' />
																</div>
															</p>
														) : (
															<span
																style={{
																	width: 'auto',
																	position: 'absolute',
																	right: '35px',
																}}
															>
																{t('activityDone')}
															</span>
														)}
													</button>
												</div>
											))}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			<Modal
				modalText={modalText}
				modalVisible={isModalVisible}
				onClose={closeModal}
				modalType={modalType}
				buttonText={buttonText}
				onButtonClick={closeModal}
			/>
		</>
	);
};

export default Footer;
