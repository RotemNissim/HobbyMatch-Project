
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import Layout from './components/Layout';

const App: React.FC = () => (
    <BrowserRouter>
    <Layout>
        <AppRouter />
        </Layout>
    </BrowserRouter>
);

export default App;
