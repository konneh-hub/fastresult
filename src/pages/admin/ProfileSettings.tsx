import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import './AdminPages.css';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  phone: string;
  avatar: string;
  // Re-export the shared ProfileSettings component so admin path uses the same implementation
  export { default } from '../ProfileSettings';
}
