import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import copy from '../../img/copy.svg';
import cross from '../../img/cross.svg';
import crown from '../../img/crown.svg';
import lead_icon from '../../img/leaderboard.webp';
import ref_icon from '../../img/referral.webp';
import face from '../../img/tigran_circle.webp';
import { useGetLeaderboardMutation } from '../../services/phpService';
import { Switch, FormControlLabel } from '@mui/material';
import './Header.scss';

const Header = ({ user }) => {
	const [isShown, setIsShown] = useState(false);
	const [totalReferrals, setTotalReferrals] = useState(user?.referrals_count);
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const [isInviteOpen, setInviteOpen] = useState(false);
	const [isElementPresent, setIsElementPresent] = useState(false);
	const [getLeaderboard] = useGetLeaderboardMutation();
	const [generatedUrl, setGeneratedUrl] = useState('');
	const [copied, setCopied] = useState(false);

	const popupClsTgl = isLeaderboardOpen ? 'popupLeaderboard_show' : null;
	const popupClasses = `popupLeaderboard ${popupClsTgl}`;

	const popupInvTgl = isInviteOpen ? 'popupInvite_show' : null;
	const popupInvite = `popupInvite ${popupInvTgl}`;

	const containerRef = useRef(null);
	const menuRef = useRef(null);

	const tg = window.Telegram.WebApp;

	// Localisation
	const { t, i18n } = useTranslation();

	// Retrieve the initial language from localStorage or default to 'en'
	const initLanguage = localStorage.getItem('language') || 'ru';
	const [language, setLanguage] = useState(initLanguage);

	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language, i18n]);

	const changeLanguage = (language) => {
		i18n.changeLanguage(language);
		localStorage.setItem('language', language); // Save to localStorage
	};

	const toggleLanguage = () => {
		const newLanguage = language === 'ru' ? 'en' : 'ru';
		setLanguage(newLanguage);
		changeLanguage(newLanguage);
	};

	const toggleMenu = () => {
		setIsShown((prev) => !prev);
	};

	useEffect(() => {
		// Update i18n language when user.language_code changes
		changeLanguage(language);
	}, [language]);

	const handleTGUrl = () => {
		let url;
		if (initLanguage === 'ru') {
			url = 'https://t.me/TigerCash_ru';
		} else if (initLanguage === 'en') {
			url = 'https://t.me/TigerCashChannel';
		}
		window.open(url, '_blank');
	};

	useEffect(() => {
		const observer = new MutationObserver((mutationsList) => {
			mutationsList.forEach((mutation) => {
				if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
					const targetElement = document.getElementById('header__totalScore');
					if (targetElement) {
						setIsElementPresent(true);
					}
				} else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
					const targetElement = document.getElementById('header__totalScore');
					if (!targetElement) {
						setIsElementPresent(false);
					}
				}
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		setTotalReferrals(user?.referrals_count);
	}, [user]);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (menuRef.current && menuRef.current.contains(event.target)) {
				return;
			}
			if (event.target.closest('.header__menuBtn')) return;
			setIsShown(false);
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	const leaderBordBtn = () => {
		const fetchData = async () => {
			if (Object.keys(user).length) {
				const res = await getLeaderboard(user.id_telegram).unwrap();
				setLeaderboardData(res);
			}
		};
		fetchData();

		fadeShow();
		setIsShown(false);
		setTimeout(() => {
			setLeaderboardOpen(true);
		}, 250);
	};

	const inviteFriendsBtn = () => {
		fadeShow();
		setIsShown(false);
		setTimeout(() => {
			setInviteOpen(true);
		}, 250);
	};

	const fadeShow = () => {
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		if (htmlTag) htmlTag.classList.add('popupLeaderboard-show');
		if (headerTag) headerTag.classList.add('show-blur');
		if (mainTag) mainTag.classList.add('show-blur');
		if (footerTag) footerTag.classList.add('show-blur');
	};

	const сloseToggler = () => {
		setLeaderboardOpen(false);
		setInviteOpen(false);
		const htmlTag = document.getElementById('html');
		if (htmlTag) htmlTag.classList.remove('popupLeaderboard-show');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const bgTag = document.getElementById('bgImage');
		const footerTag = document.getElementById('footer');
		if (headerTag) headerTag.classList.remove('show-blur');
		if (mainTag) mainTag.classList.remove('show-blur');
		if (bgTag) bgTag.classList.remove('h100');
		if (footerTag) footerTag.classList.remove('show-blur');
	};

	useEffect(() => {
		// Load the URL from localStorage on mount
		const storedUrl = localStorage.getItem('generatedUrl');
		if (storedUrl) {
			setGeneratedUrl(storedUrl);
		}
	}, []);

	const generateUrl = (user) => {
		if (user.id_telegram) {
			const referralURL = `t.me/Tema_cash_bot/app?startapp=${user.id_telegram}`;
			setGeneratedUrl(referralURL);
			localStorage.setItem('generatedUrl', referralURL);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(generatedUrl)
			.then(() => {
				setCopied(true);
				setTimeout(() => {
					setCopied(false);
				}, 2000);
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

	return (
		<>
			<header id='header' className='header'>
				<div className='header__logo'>
					<img src={face} alt='Tiger-logo' />
				</div>
				<div className='header__btn-group'>
					<div className='header__social-links'>
						<a className='header__social-link' onClick={handleTGUrl}>
							<svg
								width='24'
								height='19'
								viewBox='0 0 24 19'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M19.8625 18.078L23.544 1.81156C23.724 1.01656 22.8754 0.352279 22.0547 0.639422L21.6647 0.778707L0.49754 8.40514C0.347985 8.45228 0.218196 8.54752 0.128351 8.67603C0.0385062 8.80455 -0.00635979 8.95916 0.00072731 9.1158C0.00781441 9.27245 0.0664576 9.42237 0.16754 9.54225C0.268623 9.66214 0.406482 9.74526 0.559683 9.77871L6.03897 11.2787L7.06111 14.2787L8.08325 17.2787C8.1422 17.4256 8.2361 17.5559 8.3568 17.6583C8.47751 17.7607 8.62137 17.8321 8.77592 17.8663C8.93046 17.9005 9.09102 17.8965 9.24365 17.8546C9.39629 17.8127 9.5364 17.7342 9.65182 17.6259L12.4825 14.9494L18.0411 18.7209C18.7204 19.1859 19.689 18.8409 19.8625 18.078ZM9.78959 12.0736L19.3532 4.25651C19.5932 4.05936 19.3146 3.71651 19.0424 3.87508L17.1696 4.94651L7.21816 10.6508C7.11894 10.7037 7.04142 10.7897 6.99913 10.8938C6.95683 10.998 6.95245 11.1137 6.98673 11.2208L7.7903 13.6101L8.56816 15.9458C8.57072 15.9742 8.58446 16.0004 8.60636 16.0187C8.62826 16.037 8.65653 16.0458 8.68495 16.0433C8.71336 16.0407 8.7396 16.027 8.75788 16.0051C8.77617 15.9832 8.785 15.9549 8.78244 15.9265L9.05887 13.5908L9.15959 12.7594C9.17619 12.6343 9.24073 12.5206 9.33959 12.4422L9.78959 12.0736Z'
									fill='#1C2520'
								/>
							</svg>
						</a>
						<a
							className='header__social-link'
							onClick={() => {
								window.open('https://x.com/tema_cash', '_blank');
							}}
						>
							<svg
								width='24'
								height='22'
								viewBox='0 0 24 22'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M18.7187 0.5H22.2172L14.5739 9.2358L23.5657 21.1233H16.5252L11.0109 13.9136L4.7012 21.1233H1.20054L9.37581 11.7793L0.75 0.5H7.9692L12.9537 7.08992L18.7187 0.5ZM17.4908 19.0292H19.4294L6.91583 2.48406H4.83552L17.4908 19.0292Z'
									fill='#1C2520'
								/>
							</svg>
						</a>
					</div>
					<button className='header__menuBtn' ref={containerRef} onClick={toggleMenu}>
						{t('menuBtn')}
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M12 1.5C12.2672 1.5 12.2906 1.50937 12.4875 1.70156C12.6422 1.84687 12.7078 1.95 12.7734 2.29219L13.0547 2.32031C13.2094 2.33906 13.5797 2.40469 13.875 2.47031C14.1703 2.53594 14.6156 2.6625 14.8594 2.75156C15.1031 2.84531 15.4828 3.00937 15.7031 3.11719C15.9234 3.22969 16.2516 3.42187 16.4391 3.54375C16.6219 3.67031 16.9266 3.90937 17.1141 4.07812C17.3016 4.24688 17.5828 4.54219 17.7328 4.73438C17.8875 4.92656 18.0938 5.24063 18.1922 5.42813C18.2953 5.61094 18.3844 5.76562 18.3984 5.76562C18.4125 5.76562 18.7312 5.83125 19.1156 5.91094C19.4953 5.99062 20.0484 6.12656 20.3438 6.21094C20.6391 6.29531 21.0938 6.44531 21.3516 6.53906C21.6094 6.6375 21.9891 6.79688 22.1953 6.9C22.4016 7.00312 22.7062 7.18125 22.875 7.28906C23.0438 7.39687 23.2969 7.6125 23.4375 7.7625C23.5828 7.91719 23.7609 8.16563 23.8359 8.32031C23.9578 8.56406 23.9766 8.65312 23.9766 9C23.9766 9.34219 23.9578 9.44063 23.8406 9.67969C23.7703 9.83438 23.5922 10.0875 23.4422 10.2375C23.2969 10.3875 23.0203 10.6172 22.8281 10.7437C22.6359 10.875 22.3078 11.0578 22.1016 11.1562C21.8953 11.2547 21.4828 11.4187 21.1875 11.5219C20.8922 11.625 20.3016 11.7937 19.875 11.9016C19.4484 12.0047 18.8156 12.1453 18.4688 12.2109C18.1219 12.2719 17.4609 12.375 17.0016 12.4313C16.2141 12.5344 16.1672 12.5437 16.1906 12.6328C16.2047 12.6844 16.9453 14.3625 17.8406 16.3594C18.9188 18.7781 19.4719 20.0625 19.4859 20.2031C19.5047 20.3625 19.4812 20.4797 19.4016 20.6672C19.3312 20.8266 19.2 21 19.05 21.1359C18.9234 21.2531 18.6891 21.4172 18.5344 21.5016C18.3844 21.5813 18.0375 21.7266 17.7656 21.8156C17.4937 21.9047 17.0109 22.0312 16.6875 22.0969C16.3641 22.1625 15.8578 22.2469 15.5625 22.2844C15.2672 22.3219 14.7188 22.3828 14.3438 22.4156C13.9359 22.4531 12.9937 22.4766 12 22.4766C11.0344 22.4766 10.05 22.4531 9.65625 22.4156C9.28125 22.3828 8.67188 22.3125 8.29688 22.2609C7.92188 22.2094 7.37344 22.1156 7.07812 22.0453C6.78281 21.9797 6.36094 21.8625 6.14062 21.7875C5.92031 21.7078 5.61562 21.5813 5.46562 21.5016C5.31094 21.4172 5.07656 21.2531 4.95 21.1359C4.8 21 4.66875 20.8266 4.59844 20.6672C4.51875 20.4797 4.49531 20.3625 4.51406 20.2031C4.52813 20.0625 5.08125 18.7781 6.15937 16.3594C7.05469 14.3625 7.79531 12.6844 7.80938 12.6328C7.83281 12.5437 7.79531 12.5344 7.30313 12.4781C7.0125 12.4406 6.4125 12.3516 5.97656 12.2812C5.53594 12.2109 4.84219 12.0703 4.42969 11.9766C4.01719 11.8828 3.375 11.7047 3 11.5781C2.625 11.4563 2.14219 11.2688 1.92188 11.1656C1.70156 11.0625 1.36406 10.8703 1.17188 10.7437C0.979688 10.6172 0.703125 10.3875 0.557812 10.2375C0.407812 10.0875 0.229688 9.83438 0.159375 9.67969C0.0421875 9.44063 0.0234375 9.34219 0.0234375 9C0.0234375 8.67188 0.046875 8.55469 0.145312 8.34375C0.210938 8.20312 0.389063 7.95 0.54375 7.78594C0.69375 7.62188 0.95625 7.39687 1.125 7.28906C1.29375 7.18125 1.59844 7.00312 1.80469 6.9C2.01094 6.79688 2.38125 6.64219 2.625 6.54844C2.86875 6.45937 3.3 6.31406 3.58594 6.23438C3.86719 6.15 4.32188 6.0375 4.59375 5.97656C4.86562 5.91563 5.20781 5.84531 5.625 5.76562L5.80781 5.42344C5.90625 5.24062 6.1125 4.92656 6.26719 4.73438C6.42188 4.54219 6.67969 4.26094 6.84844 4.11094C7.0125 3.95625 7.34062 3.70781 7.57031 3.55313C7.8 3.39844 8.13281 3.19688 8.30625 3.1125C8.48438 3.02344 8.78906 2.8875 8.98594 2.80781C9.1875 2.72813 9.58125 2.60625 9.86719 2.53125C10.1531 2.46094 10.575 2.37187 11.2453 2.27344L11.2734 2.08594C11.2969 1.94531 11.3578 1.84688 11.5125 1.69688C11.7094 1.50938 11.7328 1.5 12 1.5ZM10.6172 3.87656C10.4109 3.91406 10.0641 4.0125 9.84375 4.0875C9.62344 4.16719 9.29531 4.30312 9.11719 4.39219C8.93437 4.48594 8.64375 4.65469 8.46563 4.77656C8.2875 4.89375 8.02969 5.09062 7.89375 5.2125C7.75312 5.33906 7.65469 5.44688 7.67344 5.45625C7.69687 5.46563 8.01562 5.44688 8.39062 5.41406C8.76562 5.37656 9.51094 5.32969 10.0547 5.30156C10.5984 5.27344 11.4703 5.25 12 5.25C12.5297 5.25 13.4016 5.27344 13.9453 5.30156C14.4891 5.32969 15.2344 5.37656 15.6094 5.41406C15.9844 5.44688 16.3031 5.46563 16.3219 5.45625C16.3453 5.44688 16.2375 5.32969 16.0875 5.19844C15.9422 5.06719 15.6844 4.87031 15.5156 4.75781C15.3469 4.65 15.0656 4.48594 14.8828 4.39219C14.7 4.30312 14.3953 4.17188 14.2031 4.10156C14.0109 4.03594 13.6734 3.93281 13.4531 3.88594C13.1531 3.81563 12.8391 3.7875 12.1875 3.77344C11.7094 3.76406 11.2453 3.76875 11.1562 3.77812C11.0672 3.79219 10.8234 3.83437 10.6172 3.87656ZM8.34375 6.91406C7.89375 6.95625 7.1625 7.04063 6.72656 7.10625C6.28594 7.17188 5.68594 7.275 5.39062 7.33594C5.09531 7.39687 4.64062 7.5 4.38281 7.56562C4.125 7.63125 3.67969 7.75781 3.39844 7.85156C3.1125 7.94531 2.66719 8.12813 2.4 8.25469C2.11875 8.39063 1.8375 8.56406 1.71094 8.68594C1.57344 8.81719 1.50469 8.92188 1.50469 9C1.50469 9.07812 1.57031 9.17656 1.70156 9.29531C1.80937 9.39375 2.07656 9.5625 2.29688 9.675C2.51719 9.7875 2.89687 9.95625 3.14062 10.0453C3.38438 10.1391 3.87188 10.2891 4.21875 10.3781C4.56563 10.4719 5.01094 10.5797 5.20312 10.6172C5.39531 10.6594 5.85938 10.7437 6.23438 10.8047C6.60938 10.8703 7.27031 10.9641 7.71094 11.0109L8.50781 11.1C8.86875 10.725 9.07969 10.5422 9.21094 10.4531C9.3375 10.3641 9.57187 10.2375 9.72656 10.1672C9.88125 10.0969 10.1766 9.99844 10.3828 9.94219C10.5891 9.89062 10.95 9.825 11.1797 9.79688C11.4094 9.77344 11.7797 9.75 12 9.75C12.2203 9.75 12.5906 9.77344 12.8203 9.79688C13.05 9.825 13.4109 9.89062 13.6172 9.94687C13.8234 9.99844 14.1187 10.1016 14.2734 10.1672C14.4281 10.2375 14.6484 10.3594 14.7656 10.4391C14.8828 10.5141 15.0938 10.6969 15.2344 10.8422L15.4922 11.1047C16.4344 10.9969 16.9969 10.9266 17.3438 10.875C17.6906 10.8234 18.2391 10.7297 18.5625 10.6641C18.8859 10.5984 19.4344 10.4719 19.7812 10.3781C20.1281 10.2891 20.6156 10.1391 20.8594 10.0453C21.1031 9.95625 21.4828 9.7875 21.7031 9.675C21.9234 9.5625 22.1906 9.39375 22.2984 9.29531C22.4297 9.17656 22.4953 9.07812 22.4953 9C22.4953 8.92188 22.4266 8.81719 22.2891 8.68594C22.1625 8.56406 21.8813 8.39063 21.5953 8.25469C21.3328 8.12344 20.8969 7.95 20.625 7.85625C20.3531 7.76719 19.9125 7.64062 19.6406 7.57031C19.3687 7.5 18.9047 7.39687 18.6094 7.33594C18.3141 7.275 17.7141 7.17188 17.2734 7.10625C16.8328 7.04063 16.1297 6.95625 15.7031 6.91875C15.2766 6.87656 14.5078 6.825 13.9922 6.79688C13.4766 6.77344 12.5063 6.75469 11.8359 6.75937C11.1656 6.75937 10.2891 6.77813 9.89062 6.80156C9.49219 6.82031 8.79375 6.87187 8.34375 6.91406ZM10.6875 11.4188C10.5469 11.4609 10.3359 11.5406 10.2188 11.6016C10.1016 11.6625 9.95156 11.7703 9.88125 11.8453C9.80156 11.925 9.08906 13.4672 7.99219 15.9375C7.01719 18.1172 6.20156 19.9594 6.16875 20.0297C6.12656 20.1422 6.13125 20.1703 6.1875 20.2078C6.225 20.2266 6.45937 20.3109 6.70312 20.3859C6.94688 20.4656 7.35938 20.5734 7.61719 20.6203C7.875 20.6719 8.42344 20.7563 8.83594 20.8125C9.24844 20.8641 9.93281 20.925 10.3594 20.9531C10.7859 20.9766 11.5219 21 12 21C12.4781 21 13.2141 20.9766 13.6406 20.9531C14.0672 20.925 14.7516 20.8641 15.1641 20.8125C15.5766 20.7563 16.125 20.6719 16.3828 20.6203C16.6406 20.5688 17.0531 20.4656 17.2969 20.3906C17.5406 20.3156 17.775 20.2313 17.8125 20.2078C17.8687 20.1703 17.8734 20.1422 17.8312 20.0297C17.7984 19.9594 16.9828 18.1172 16.0078 15.9375C14.9109 13.4719 14.1984 11.925 14.1188 11.8453C14.0484 11.7703 13.8844 11.6578 13.7578 11.5922C13.6266 11.5266 13.3641 11.4328 13.1719 11.3813C12.9328 11.3203 12.6141 11.2828 12.1641 11.2734C11.8031 11.2641 11.3813 11.2734 11.2266 11.3016C11.0719 11.325 10.8281 11.3766 10.6875 11.4188ZM8.98594 7.5C9.07031 7.5 9.21094 7.52813 9.29062 7.56094C9.375 7.59844 9.50156 7.69219 9.57187 7.77188C9.64687 7.85625 9.71719 8.00156 9.73125 8.1C9.74531 8.19375 9.74531 8.34844 9.72656 8.4375C9.70781 8.53125 9.61875 8.67188 9.52031 8.77031C9.40781 8.88594 9.28906 8.95469 9.16406 8.97656C9.06094 8.99531 8.90156 8.99531 8.8125 8.97656C8.71875 8.95781 8.57812 8.86875 8.47969 8.77031C8.36406 8.65781 8.29531 8.53906 8.27344 8.41406C8.25469 8.31094 8.25469 8.15625 8.26875 8.07656C8.28281 7.99219 8.34844 7.85625 8.40469 7.77656C8.46562 7.69219 8.5875 7.59844 8.67656 7.56562C8.76562 7.53281 8.90625 7.50469 8.98594 7.5ZM14.9859 7.5C15.0703 7.5 15.2109 7.52813 15.2906 7.56094C15.375 7.59844 15.5016 7.69219 15.5719 7.77188C15.6469 7.85625 15.7172 8.00156 15.7313 8.1C15.7453 8.19375 15.7453 8.34844 15.7266 8.4375C15.7078 8.53125 15.6188 8.67188 15.5203 8.77031C15.4078 8.88594 15.2891 8.95469 15.1641 8.97656C15.0609 8.99531 14.9016 8.99531 14.8125 8.97656C14.7188 8.95781 14.5781 8.86875 14.4797 8.77031C14.3641 8.65781 14.2953 8.53906 14.2734 8.41406C14.2547 8.31094 14.2547 8.15625 14.2687 8.07656C14.2828 7.99219 14.3484 7.85625 14.4047 7.77656C14.4656 7.69219 14.5875 7.59844 14.6766 7.56562C14.7656 7.53281 14.9063 7.50469 14.9859 7.5ZM5.23594 8.25C5.32031 8.25 5.46094 8.27813 5.54062 8.31094C5.625 8.34844 5.75156 8.44219 5.82187 8.52188C5.89687 8.60625 5.96719 8.75156 5.98125 8.85C5.99531 8.94375 5.99531 9.09844 5.97656 9.1875C5.95781 9.28125 5.86875 9.42188 5.77031 9.52031C5.65781 9.63594 5.53906 9.70469 5.41406 9.72656C5.31094 9.74531 5.15156 9.74531 5.0625 9.72656C4.96875 9.70781 4.82812 9.61875 4.72969 9.52031C4.61406 9.40781 4.54531 9.28906 4.52344 9.16406C4.50469 9.06094 4.50469 8.90625 4.51875 8.82656C4.53281 8.74219 4.59844 8.60625 4.65469 8.52656C4.71563 8.44219 4.8375 8.34844 4.92656 8.31562C5.01562 8.28281 5.15625 8.25469 5.23594 8.25ZM18.7406 8.25C18.8203 8.25 18.9609 8.27813 19.0406 8.31094C19.125 8.34844 19.2516 8.44219 19.3219 8.52188C19.3969 8.60625 19.4672 8.75156 19.4813 8.85C19.4953 8.94375 19.4953 9.09844 19.4766 9.1875C19.4578 9.28125 19.3687 9.42188 19.2703 9.52031C19.1578 9.63594 19.0391 9.70469 18.9141 9.72656C18.8109 9.74531 18.6516 9.74531 18.5625 9.72656C18.4688 9.70781 18.3281 9.61875 18.2297 9.52031C18.1141 9.40781 18.0453 9.28906 18.0234 9.16406C18.0047 9.06094 18.0047 8.90625 18.0187 8.82656C18.0328 8.74219 18.0984 8.60625 18.1547 8.52656C18.2156 8.44219 18.3375 8.34844 18.4266 8.31562C18.5156 8.28281 18.6562 8.25469 18.7359 8.25H18.7406Z'
								fill='#1C2520'
							/>
						</svg>
					</button>
					{isShown && (
						<div className='header__menu' ref={menuRef}>
							<a className='header__menu-links' onClick={leaderBordBtn}>
								{t('menuLeaderboard')}
								<img src={lead_icon} alt='Leaderboard Icon' />
							</a>
							<a
								className='header__menu-links'
								onClick={inviteFriendsBtn}
								rel='noopener noreferrer'
							>
								{t('menuReferral')}
								<img src={ref_icon} alt='Referral Icon' />
							</a>
							<div className='header__menu-toggle'>
								<FormControlLabel
									label={
										<span
											style={{
												fontSize: '24px',
												fontWeight: '400',
												fontFamily: 'Oswald',
												textTransform: 'uppercase',
											}}
										>
											{language === 'ru' ? 'Switch to English' : 'Врубить Русский'}
										</span>
									}
									labelPlacement='start'
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										width: '100%',
										border: '1px solid #172610',
										borderRadius: '10px',
										padding: '16px 16px 16px 24px',
										height: '56px',
										fontWeight: '400',
										lineHeight: '100%',
										letterSpacing: '0.02em',
										color: 'var(--mainColor)',
										margin: '0',
									}}
									control={
										<Switch
											checked={language !== 'ru'}
											onChange={toggleLanguage}
											sx={{
												'& .MuiSwitch-switchBase.Mui-checked': {
													color: 'green',
												},
												'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
													backgroundColor: 'green',
												},
											}}
										/>
									}
								/>
							</div>
						</div>
					)}
				</div>
			</header>
			{isInviteOpen && (
				<div id='popupInvite' aria-hidden='true' className={popupInvite}>
					<div className='popupInvite__wrapper'>
						<div className='popupInvite__content'>
							<button onClick={сloseToggler} type='button' className='popupInvite__close'>
								<img src={cross} />
							</button>
							<div className='popupInvite__title'>
								<h4>{t('referralTitle')}</h4>
							</div>
							<div className='popupInvite__refInfo'>
								<div className='popupInvite__refInfo-box'>
									<p>{t('refBonus')}</p>
									<div className='popupInvite__refInfo-item'>
										<span>10 %</span>
									</div>
								</div>
								{totalReferrals >= 0 && (
									<div className='popupInvite__refInfo-box'>
										<p> {t('refCount')}</p>
										<div className='popupInvite__refInfo-item'>
											<span>{totalReferrals}</span>
										</div>
									</div>
								)}
							</div>
							<div className='popupInvite__header'>
								<h6> {t('refHowTo')}</h6>
							</div>
							<div className='popupInvite__grid'>
								<ul className='popupInvite__grid-list'>
									<li className='popupInvite__list-item'>
										<svg
											width='24'
											height='25'
											viewBox='0 0 24 25'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M17.9984 14.4999C17.9454 14.4999 17.8984 14.5139 17.8434 14.5159L14.8154 9.33787C15.3783 8.77987 15.7627 8.0672 15.9199 7.29033C16.0771 6.51345 15.9999 5.70739 15.6982 4.97444C15.3965 4.24149 14.8838 3.61471 14.2253 3.17363C13.5667 2.73255 12.792 2.49707 11.9994 2.49707C11.2067 2.49707 10.432 2.73255 9.77343 3.17363C9.11487 3.61471 8.60221 4.24149 8.30049 4.97444C7.99877 5.70739 7.92161 6.51345 8.0788 7.29033C8.23599 8.0672 8.62044 8.77987 9.18335 9.33787L6.16435 14.5169C6.10735 14.5139 6.05535 14.4999 5.99835 14.4999C5.24963 14.4973 4.5152 14.7048 3.87863 15.099C3.24205 15.4931 2.72888 16.0581 2.39749 16.7295C2.06611 17.4009 1.92982 18.1518 2.00412 18.8968C2.07843 19.6419 2.36035 20.3511 2.81782 20.9438C3.27528 21.5365 3.88992 21.9889 4.59181 22.2496C5.29369 22.5103 6.05465 22.5687 6.78811 22.4183C7.52157 22.2678 8.19808 21.9145 8.74067 21.3986C9.28327 20.8827 9.67017 20.2248 9.85735 19.4999H14.1394C14.3275 20.2227 14.7146 20.8784 15.2566 21.3923C15.7987 21.9062 16.474 22.2578 17.2058 22.4072C17.9377 22.5566 18.6968 22.4977 19.3969 22.2373C20.097 21.9769 20.71 21.5255 21.1664 20.9342C21.6228 20.3428 21.9042 19.6354 21.9787 18.8922C22.0532 18.1489 21.9177 17.3997 21.5878 16.7296C21.2578 16.0595 20.7466 15.4953 20.1121 15.1012C19.4776 14.707 18.7453 14.4987 17.9984 14.4999ZM14.1394 17.4999H9.85735C9.6034 16.5166 8.98444 15.667 8.12635 15.1239L10.9194 10.3339C11.6226 10.5559 12.3771 10.5559 13.0804 10.3339L15.8804 15.1199C15.0173 15.6617 14.3944 16.5133 14.1394 17.4999Z'
												fill='#0D9047'
											/>
										</svg>
										<div className='popupInvite__list-itemDescr'>
											<h4>{t('refInvite')}</h4>
											<p> {t('refInviteDescr')}</p>
										</div>
									</li>
									<li className='popupInvite__list-item'>
										<svg
											width='24'
											height='25'
											viewBox='0 0 24 25'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M17.6642 7.67871L13.1914 21.8426L24.0007 7.67871H17.6642Z'
												fill='#0D9047'
											/>
											<path
												d='M3.48456 2.66895L0.0507812 6.78949H5.88822L3.48456 2.66895Z'
												fill='#0D9047'
											/>
											<path
												d='M20.5169 2.66895L18.1133 6.78949H23.9507L20.5169 2.66895Z'
												fill='#0D9047'
											/>
											<path
												d='M6.33647 7.67871H0L10.8093 21.8426L6.33647 7.67871Z'
												fill='#0D9047'
											/>
											<path
												d='M13.0742 2.34082L17.2446 6.5112L19.6771 2.34082H13.0742Z'
												fill='#0D9047'
											/>
											<path
												d='M4.32422 2.34082L6.75675 6.5112L10.9271 2.34082H4.32422Z'
												fill='#0D9047'
											/>
											<path
												d='M7.26953 7.67871L12.0003 22.6588L16.7312 7.67871H7.26953Z'
												fill='#0D9047'
											/>
											<path
												d='M11.9981 2.52539L7.73438 6.78914H16.2619L11.9981 2.52539Z'
												fill='#0D9047'
											/>
										</svg>
										<div className='popupInvite__list-itemDescr'>
											<h4>{t('refRewards')}</h4>
											<p>{t('refRewardsDescr')}</p>
										</div>
									</li>
								</ul>
							</div>
							<div className='popupInvite__item-box'>
								<div className='popupInvite__item-group'>
									<p>{t('refLink')}</p>
									<p className='popupInvite__input'>
										{generatedUrl.length ? `${generatedUrl}` : `${t('refLinkDescr')}`}
										<button onClick={copyToClipboard} className='popupInvite__input-btn'>
											<img src={copy} alt='' />
										</button>
										{copied && <span className='copied-message'>{t('refLinkCopy')}</span>}
									</p>
								</div>
								<div className='popupInvite__item-group'>
									<button
										className='popupInvite__submit'
										onClick={() => generateUrl(user)}
									>
										{t('refLinkBtn')}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{isLeaderboardOpen && (
				<div id='leaderboard' aria-hidden='true' className={popupClasses}>
					<div className='popupLeaderboard__wrapper'>
						<div className='popupLeaderboard__content'>
							<div className='popupLeaderboard__title'>
								<img src={crown} alt='crown' />
								<h4> {t('leaderboardTitle')}</h4>
								<button
									onClick={сloseToggler}
									type='button'
									className='popupInvite__close'
								>
									<img src={cross} />
								</button>
							</div>
							<div className='popupLeaderboard__playerList'>
								<ul className='popupLeaderboard__table'>
									{leaderboardData.map((player, index) => {
										const isCurrentUser = player.username === user.username;
										const isTopThree = index < 2;
										return (
											<li
												className={`popupLeaderboard__tableItem ${
													isCurrentUser && !isTopThree ? 'highlight' : ''
												}`}
												key={index}
											>
												<div className='popupLeaderboard__itemData'>
													<div className='popupLeaderboard__id'>
														<svg
															width='27'
															height='27'
															viewBox='0 0 27 27'
															fill='none'
															xmlns='http://www.w3.org/2000/svg'
														>
															<path
																d='M21.0093 4.59837C21.4312 5.31556 21.8952 5.90618 22.4858 6.28587C23.0765 6.66556 23.7093 6.91868 24.3421 6.74993C23.878 4.8515 22.064 3.92337 21.0093 4.59837Z'
																fill='#FFE351'
															/>
															<path
																d='M25.1018 2.3623C25.6924 3.41699 25.819 4.47168 25.6502 5.27324C25.4815 6.0748 24.9752 6.62324 24.3424 6.7498C23.9205 4.97793 23.9627 3.0373 25.1018 2.3623Z'
																fill='#FFE351'
															/>
															<path
																d='M22.1064 7.50918C22.2752 8.26855 22.6127 8.94355 23.0346 9.4498C23.4564 9.95605 24.0471 10.3357 24.6799 10.3779C24.7643 8.47949 23.3299 7.17168 22.1064 7.50918Z'
																fill='#FFE351'
															/>
															<path
																d='M26.6625 6.53906C26.9156 7.63594 26.7469 8.64844 26.325 9.36563C25.9031 10.0828 25.3125 10.4203 24.6797 10.4203C24.7641 8.60625 25.3969 6.87656 26.6625 6.53906Z'
																fill='#FFE351'
															/>
															<path
																d='M22.3595 10.5469C22.3173 11.3062 22.4438 12.0234 22.7392 12.6141C23.0345 13.2047 23.4563 13.7531 24.0892 13.9219C24.6376 12.1078 23.6251 10.5469 22.3595 10.5469Z'
																fill='#FFE351'
															/>
															<path
																d='M26.9998 10.7998C26.9154 11.8967 26.4936 12.8248 25.9451 13.3732C25.3545 13.9217 24.6795 14.1326 24.0889 13.9217C24.5951 12.2342 25.692 10.7998 26.9998 10.7998Z'
																fill='#FFE351'
															/>
															<path
																d='M21.7686 13.4575C21.5155 14.1747 21.4733 14.8919 21.5999 15.5669C21.7264 16.2419 22.0217 16.8325 22.5702 17.2122C23.5405 15.5669 22.9921 13.795 21.7686 13.4575Z'
																fill='#FFE351'
															/>
															<path
																d='M26.1984 14.934C25.8609 15.9465 25.1859 16.7481 24.5109 17.1278C23.7937 17.5075 23.1187 17.5075 22.5703 17.17C23.4984 15.6934 24.9328 14.5543 26.1984 14.934Z'
																fill='#FFE351'
															/>
															<path
																d='M5.99053 4.59837C5.56865 5.31556 5.10459 5.90618 4.51396 6.28587C3.92334 6.66556 3.29053 6.91868 2.65771 6.74993C3.12178 4.8515 4.93584 3.92337 5.99053 4.59837Z'
																fill='#FFE351'
															/>
															<path
																d='M1.89849 2.3623C1.30786 3.41699 1.1813 4.47168 1.35005 5.27324C1.5188 6.0748 2.02505 6.62324 2.65786 6.7498C3.07974 4.97793 3.03755 3.0373 1.89849 2.3623Z'
																fill='#FFE351'
															/>
															<path
																d='M4.89389 7.50918C4.72514 8.26855 4.38764 8.94355 3.96576 9.4498C3.54389 9.95605 2.95326 10.3357 2.32045 10.3779C2.23607 8.47949 3.67045 7.17168 4.89389 7.50918Z'
																fill='#FFE351'
															/>
															<path
																d='M0.33768 6.53906C0.0845549 7.63594 0.253305 8.64844 0.67518 9.36563C1.09705 10.0828 1.68768 10.4203 2.32049 10.4203C2.23612 8.60625 1.60331 6.87656 0.33768 6.53906Z'
																fill='#FFE351'
															/>
															<path
																d='M4.64058 10.5469C4.68277 11.3062 4.55621 12.0234 4.26089 12.6141C4.00777 13.2047 3.5437 13.7531 2.95308 13.9219C2.36245 12.1078 3.37495 10.5469 4.64058 10.5469Z'
																fill='#FFE351'
															/>
															<path
																d='M0 10.7998C0.084375 11.8967 0.50625 12.8248 1.05469 13.3732C1.64531 13.9217 2.32031 14.1326 2.95312 13.9217C2.40469 12.2342 1.30781 10.7998 0 10.7998Z'
																fill='#FFE351'
															/>
															<path
																d='M5.23111 13.4575C5.48424 14.1747 5.52642 14.8919 5.39986 15.5669C5.2733 16.2419 4.97799 16.8325 4.42955 17.2122C3.45924 15.5669 4.00767 13.795 5.23111 13.4575Z'
																fill='#FFE351'
															/>
															<path
																d='M0.801758 14.934C1.13926 15.9465 1.81426 16.7481 2.48926 17.1278C3.20645 17.5075 3.88145 17.5075 4.42988 17.17C3.50176 15.6934 2.06738 14.5543 0.801758 14.934Z'
																fill='#FFE351'
															/>
														</svg>
														<span>{player.position}</span>
													</div>
													<div className='popupLeaderboard__playerName'>
														<span>{player.username}</span>
													</div>
													<div className='popupLeaderboard__coins'>
														<span>{player.wallet_balance}</span>
													</div>
												</div>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
