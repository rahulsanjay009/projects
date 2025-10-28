import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Authorize from './components/Authorization/Authorize';
import HomePage from './components/HomePage/HomePage';
import InventoryConsole from './components/InventoryConsole/InventoryConsole';
import Orders from './components/Orders/Orders';
import ScheduledPickups from './components/ScheduledPickups/ScheduledPickups';
import OldOrders from './components/OldOrders/OldOrders';
import RecentEventsConsole from './components/RecentEvents/RecentEventsConsole';
import CategoriesConsole from './components/Categories/CategoriesConsole';
import { isAuthenticated } from './components/Authorization/useAuth';

const App = () => {


const ProtectedRoute = ({ redirectPath = '/authorize' }) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

  return (
    <Router>
      <Routes>
        
        {/* The root path / checks auth status and redirects accordingly */}
        {/* <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              // If authenticated, navigate to the default page within the layout
              <Navigate to="/scheduledPickups" replace />
            ) : (
              // If not authenticated, navigate to the authorization screen
              <Navigate to="/authorize" replace />
            )
          } 
        /> */}
        
        {/* Public Route */}
        {/* <Route path="/authorize" element={<Authorize />} /> */}

        {/* Protected Routes: Only accessible if isAuthenticated() is true
        <Route element={<ProtectedRoute />}> */}
        <Route path="/" element={<HomePage />}>
            {/* These are the protected child routes */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element ={<InventoryConsole/>} />
          <Route path='/scheduledPickups' element = {<ScheduledPickups/>}/>
          <Route path='/oldOrders' element = {<OldOrders/>} />
          <Route path='/recentEvents' element={<RecentEventsConsole/>} />
          <Route path='/categories' element={<CategoriesConsole/>} />
        </Route>
        {/* </Route> */}
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
