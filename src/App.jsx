import { useState } from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import  GlobalTeacher from './components/GlobalTeacher'

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/globalTeacher" element={<GlobalTeacher />} />
          <Route path="/global-teacher-register" element={<GlobalTeacher />} />
        </Routes>
    </div>
  );
}

export default App;
