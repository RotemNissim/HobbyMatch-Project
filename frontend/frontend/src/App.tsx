import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router/AppRouter';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <AppRouter />
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
