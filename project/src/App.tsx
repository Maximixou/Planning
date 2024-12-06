import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScheduleView } from './components/ScheduleView';
import { TemplateManagement } from './components/TemplateManagement';
import { EmployeeManagement } from './components/EmployeeManagement';
import { NotificationPage } from './components/NotificationPage';
import { Layout } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Layout className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Gestionnaire d'Horaires</h1>
            </div>
            <Navigation />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ScheduleView />} />
            <Route path="/templates" element={<TemplateManagement />} />
            <Route path="/employes" element={<EmployeeManagement />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;