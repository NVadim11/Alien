import React from 'react';
// import preloaderBG from '../../img/background_mobile.webp';
import './Preloader.scss'; // Import the CSS file for styling

const Preloader = ({ loaded }) => {
	return (
		<div
		className={`preloader${loaded ? ' loaded' : ''}`}
			style={{
				// background: `url(${preloaderBG}) no-repeat center center/cover`,
			}}
		>
			<div className='preloaderText'>
				<h4>TIGER CASH</h4>
			</div>
			<div className='progressBar'>
				<div className='progress'></div>
			</div>
		</div>
	);
};

export default Preloader;
