import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainComponent from './MainComponent';

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainComponent />,
	},
	{
		path: '/:code',
		element: <MainComponent />,
	},
]);

const AppRouter = () => {
	return <RouterProvider router={router} />;
};

export default AppRouter;
