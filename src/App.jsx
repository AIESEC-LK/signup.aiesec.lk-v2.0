import { useState } from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import ProductSignUp from "./components/ProductSignUp";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/globalTeacher" element={<ProductSignUp product= "GTe" />} />
          <Route path="/globalVolunteer" element={ <ProductSignUp product= "GV" />} />
          <Route path="/globalTalent" element={ <ProductSignUp product= "GTa" />} />
          
        </Routes>
    </div>
  );
}

export default App;
