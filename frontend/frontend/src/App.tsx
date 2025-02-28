import { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // תוודא שהנתיב נכון

const App : React.FC = () => (

  
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        {/* הוספה של שאר הדפים שלך */}
      </Routes>
      </BrowserRouter>
  
)

export default App;
