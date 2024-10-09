import { useState } from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import  GlobalTeacher from './components/GlobalTeacher'
import GlobalTalent from './components/GlobalTalent'
import GlobalVolunteer from './components/GlobalVolunteer'

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/globalTeacher" element={<GlobalTeacher />} />
          <Route path="/globalVolunteer" element={ <GlobalVolunteer/>} />
          <Route path="/globalTalent" element={ <GlobalTalent/>} />
          
        </Routes>
    </div>
  );
}

export default App;
