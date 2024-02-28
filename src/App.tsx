import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import HomePage from './pages/homePage'
import { Provider } from 'react-redux'
import store from './store/store'

function App() {

	const router = createBrowserRouter([
		{
			path: "/register",
			element: <Register />
		},
		{
			path: "/login",
			element: <Login />
		},
		{
			path: "/",
			element: <HomePage />
		}
	])

	return (
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	)
}

export default App
