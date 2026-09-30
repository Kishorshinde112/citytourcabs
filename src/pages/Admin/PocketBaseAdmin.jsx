import React, { useState, useEffect } from 'react';
import { 
  Database, Activity, Wrench, Search, Plus, RefreshCw, Code, 
  ChevronRight, Trash2, Save, X, ExternalLink, Folder, Image, 
  Calendar, Hash, Type, Key, Check, Download, Mail, HardDrive, 
  Archive, Shield, Phone, MessageCircle, Smile, LogOut, ArrowLeft,
  Copy, Eye, CheckCircle2, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PocketBaseAdmin() {
  const navigate = useNavigate();
  const [activeRail, setActiveRail] = useState('collections'); // 'collections' | 'logs' | 'settings'
  const [activeCollection, setActiveCollection] = useState('Form_Submissions');
  const [activeSettingTab, setActiveSettingTab] = useState('application');
  
  // Data state
  const [records, setRecords] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [collectionSearch, setCollectionSearch] = useState('');
  
  // Drawer / Modal state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [apiPreviewOpen, setApiPreviewOpen] = useState(false);
  const [newRecordModalOpen, setNewRecordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Collections definition
  const collectionsList = [
    { id: 'Form_Submissions', name: 'Form_Submissions', count: 2462 },
    { id: 'Pages', name: 'Pages', count: 1 },
    { id: 'Settings', name: 'Settings', count: 3 },
    { id: 'Tour_Packages', name: 'Tour_Packages', count: 10 }
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch records
  const fetchRecords = async (col = activeCollection, p = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        perPage: String(perPage),
        filter: filterText.trim()
      });
      const res = await fetch(`/api/collections/${col}/records?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setRecords(prev => [...prev, ...(data.items || [])]);
        } else {
          setRecords(data.items || []);
        }
        setTotalItems(data.totalItems || 0);
        setTotalPages(data.totalPages || 1);
        setPage(data.page || p);
      }
    } catch (err) {
      console.error('Failed to load records:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeRail === 'collections') {
      fetchRecords(activeCollection, 1, false);
    }
  }, [activeCollection, activeRail]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRecords(activeCollection, 1, false);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      fetchRecords(activeCollection, nextPage, true);
    }
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setEditFormData({ ...record });
  };

  const handleSaveRecord = async () => {
    if (!selectedRecord) return;
    try {
      const res = await fetch(`/api/collections/${activeCollection}/records/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        showToast('Record updated successfully');
        setSelectedRecord(null);
        fetchRecords(activeCollection, page, false);
      }
    } catch (err) {
      showToast('Error saving record');
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    if (window.confirm(`Are you sure you want to delete record ${selectedRecord.id}?`)) {
      try {
        const res = await fetch(`/api/collections/${activeCollection}/records/${selectedRecord.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          showToast('Record deleted');
          setSelectedRecord(null);
          fetchRecords(activeCollection, 1, false);
        }
      } catch (err) {
        showToast('Error deleting record');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Log out of management portal?')) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans text-slate-800 antialiased select-none text-[13px]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fadeIn flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          1. FAR LEFT NARROW RAIL (Dark Charcoal #161922)
         ======================================================== */}
      <aside className="w-14 shrink-0 bg-[#161922] flex flex-col items-center py-3 text-slate-400 z-30 justify-between select-none">
        
        {/* Top: PocketBase Logo */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div 
            onClick={() => setActiveRail('collections')} 
            className="w-8 h-8 rounded-lg bg-[#fbbf24] flex items-center justify-center text-slate-950 font-black cursor-pointer hover:opacity-90 shadow-sm transition"
            title="PocketBase v0.22"
          >
            <span className="text-xl leading-none font-extrabold tracking-tighter">π</span>
          </div>

          {/* Navigation Action Icons */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            <button
              onClick={() => setActiveRail('collections')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                activeRail === 'collections' 
                  ? 'bg-white/10 text-white font-bold border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Collections"
            >
              <Database className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveRail('logs')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                activeRail === 'logs' 
                  ? 'bg-white/10 text-white font-bold border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Logs & API Requests"
            >
              <Activity className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveRail('settings')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                activeRail === 'settings' 
                  ? 'bg-white/10 text-white font-bold border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Settings"
            >
              <Wrench className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Bottom Avatar / Logout */}
        <div className="flex flex-col items-center gap-3 w-full pb-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
            title="View Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700 flex items-center justify-center transition cursor-pointer text-xs"
            title="Logout"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. MIDDLE SIDEBAR (Collections / Settings Tabs)
         ======================================================== */}
      <section className="w-56 shrink-0 bg-[#f8fafc] border-r border-slate-200 flex flex-col justify-between select-none">
        
        {activeRail === 'collections' ? (
          <>
            <div className="p-3 space-y-3">
              {/* Search Collections Input */}
              <div className="relative">
                <input
                  type="text"
                  value={collectionSearch}
                  onChange={(e) => setCollectionSearch(e.target.value)}
                  placeholder="Search collections..."
                  className="w-full pl-3 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
                />
              </div>

              {/* Collections Navigation List */}
              <div className="space-y-1">
                {collectionsList
                  .filter(c => c.name.toLowerCase().includes(collectionSearch.toLowerCase()))
                  .map(col => {
                    const isSelected = activeCollection === col.id;
                    return (
                      <button
                        key={col.id}
                        onClick={() => {
                          setActiveCollection(col.id);
                          setPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition cursor-pointer text-left font-medium ${
                          isSelected
                            ? 'bg-[#e2e8f0] text-slate-900 font-bold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="truncate">{col.name}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Bottom New Collection Button */}
            <div className="p-3 border-t border-slate-200/80">
              <button 
                onClick={() => showToast('Schema editing is locked for production stability')}
                className="w-full py-1.5 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New collection</span>
              </button>
            </div>
          </>
        ) : activeRail === 'settings' ? (
          /* System Settings Menu */
          <div className="p-3 space-y-4 overflow-y-auto">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">System</div>
              <div className="space-y-0.5">
                {[
                  { id: 'application', label: 'Application', icon: Wrench },
                  { id: 'mail', label: 'Mail settings', icon: Mail },
                  { id: 'storage', label: 'Files storage', icon: HardDrive },
                  { id: 'backups', label: 'Backups', icon: Archive }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSettingTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition ${
                      activeSettingTab === item.id ? 'bg-[#e2e8f0] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">Sync</div>
              <div className="space-y-0.5">
                <button 
                  onClick={() => window.open('/api/bookings/export', '_blank')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export collections</span>
                </button>
                <button 
                  onClick={() => showToast('Backup imported directly into SQLite')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-500" />
                  <span>Import collections</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">Authentication</div>
              <div className="space-y-0.5">
                {[
                  { id: 'auth_providers', label: 'Auth providers', icon: Shield },
                  { id: 'token_options', label: 'Token options', icon: Key },
                  { id: 'admins', label: 'Admins', icon: Smile }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSettingTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition ${
                      activeSettingTab === item.id ? 'bg-[#e2e8f0] text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Logs sidebar */
          <div className="p-3 space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2">Logs</div>
            <div className="p-2 rounded-md bg-[#e2e8f0] text-slate-900 font-bold text-xs flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>API Requests</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          3. MAIN WORKSPACE AREA (1:1 with PocketBase UI)
         ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {activeRail === 'collections' ? (
          <>
            {/* Top Bar: Breadcrumb + Action Buttons */}
            <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">Collections</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold text-sm">{activeCollection}</span>

                <button 
                  onClick={() => showToast('Collection schema settings')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                  title="Collection settings"
                >
                  <Wrench className="w-3.5 h-3.5" />
                </button>

                <button 
                  onClick={() => fetchRecords(activeCollection, page, false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                  title="Reload"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setApiPreviewOpen(true)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                  <span>API Preview</span>
                </button>

                <button
                  onClick={() => {
                    const emptyTemplate = activeCollection === 'Form_Submissions' 
                      ? { Type: 'Inquiry', Destination: 'Mumbai Darshan', Full_Name: '', Phone_Number: '', Travel_Date: new Date().toISOString().slice(0, 10) }
                      : { Label: '', Value: '', Context: 'N/A' };
                    setSelectedRecord(emptyTemplate);
                    setEditFormData(emptyTemplate);
                  }}
                  className="px-3.5 py-1.5 bg-[#111827] text-white rounded-md text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New record</span>
                </button>
              </div>
            </div>

            {/* Filter Input Bar */}
            <div className="px-6 py-2.5 border-b border-slate-100 bg-[#f8fafc] shrink-0">
              <form onSubmit={handleFilterSubmit} className="relative max-w-xl">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search term or filter like created > '2022-01-01'..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#e2e8f0]/60 focus:bg-white border border-transparent focus:border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 outline-none transition"
                />
              </form>
            </div>

            {/* Table Area (Horizontal & Vertical Scrollable) */}
            <div className="flex-1 overflow-auto bg-white select-text">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                
                {/* 1:1 Table Header */}
                <thead className="sticky top-0 bg-[#f8fafc] border-b border-slate-200 z-10 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-8 border-r border-slate-200/60 text-center">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </th>

                    {/* Columns for Form_Submissions */}
                    {activeCollection === 'Form_Submissions' && (
                      <>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Type</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Destination</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Package</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Car_Type</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Full_Name</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Phone_Number</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Whatsapp_Number</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> No_of_Passengers</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> Travel_Date</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Pickup_Time</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Pickup_Address</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Special_Requirements</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Referrer</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> created</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> updated</span></th>
                      </>
                    )}

                    {/* Columns for Tour_Packages */}
                    {activeCollection === 'Tour_Packages' && (
                      <>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Image className="w-3 h-3 text-slate-400" /> Banner</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Title</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Sub_title</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Summary</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Car_Types</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Booking_Packages</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Rate_Table</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> created</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> updated</span></th>
                      </>
                    )}

                    {/* Columns for Settings */}
                    {activeCollection === 'Settings' && (
                      <>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Label</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Value</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Context</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> created</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> updated</span></th>
                      </>
                    )}

                    {/* Columns for Pages */}
                    {activeCollection === 'Pages' && (
                      <>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Image className="w-3 h-3 text-slate-400" /> Banner</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Title</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-slate-400" /> Sub_title</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> created</span></th>
                        <th className="py-2.5 px-3 border-r border-slate-200/60"><span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-slate-400" /> updated</span></th>
                      </>
                    )}

                    <th className="py-2.5 px-3 text-right w-10"></th>
                  </tr>
                </thead>

                {/* 1:1 Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => (
                    <tr 
                      key={r.id} 
                      onClick={() => handleRowClick(r)}
                      className="hover:bg-[#f1f5f9]/80 cursor-pointer transition group"
                    >
                      <td className="py-2.5 px-3 text-center border-r border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-slate-300" />
                      </td>

                      {/* Record cells for Form_Submissions */}
                      {activeCollection === 'Form_Submissions' && (
                        <>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{r.id}</span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.Type === 'Booking' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {r.Type || 'Inquiry'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-800 font-medium">{r.Destination || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.Package || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.Car_Type || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-900">{r.Full_Name || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">{r.Phone_Number || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.Whatsapp_Number || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.No_of_Passengers || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">{r.Travel_Date || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.Pickup_Time || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 max-w-[180px] truncate" title={r.Pickup_Address}>{r.Pickup_Address || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.Special_Requirements || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500">{r.Referrer || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.created || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.updated || 'N/A'}</td>
                        </>
                      )}

                      {/* Record cells for Tour_Packages */}
                      {activeCollection === 'Tour_Packages' && (
                        <>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{r.id}</span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100">
                            <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden flex items-center justify-center">
                              <Image className="w-4 h-4 text-slate-500" />
                            </div>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-slate-900">{r.Title}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">{r.Sub_title}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 max-w-[200px] truncate">{r.Summary}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 max-w-[150px] truncate">{r.Car_Types}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 max-w-[150px] truncate">{r.Booking_Packages}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 max-w-[200px] truncate">{r.Rate_Table}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.created}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.updated}</td>
                        </>
                      )}

                      {/* Record cells for Settings */}
                      {activeCollection === 'Settings' && (
                        <>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{r.id}</span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-slate-800">{r.Label}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-900 font-semibold">{r.Value}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400">{r.Context || 'N/A'}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.created}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.updated}</td>
                        </>
                      )}

                      {/* Record cells for Pages */}
                      {activeCollection === 'Pages' && (
                        <>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{r.id}</span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100">
                            <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden flex items-center justify-center">
                              <Image className="w-4 h-4 text-slate-500" />
                            </div>
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-slate-900">{r.Title}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">{r.Sub_title}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.created}</td>
                          <td className="py-2.5 px-3 border-r border-slate-100 text-slate-400 text-[11px]">{r.updated}</td>
                        </>
                      )}

                      {/* Hover Arrow */}
                      <td className="py-2.5 px-3 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 1:1 Bottom Status Bar & Pagination */}
            <div className="h-12 px-6 border-t border-slate-200 bg-white flex items-center justify-between shrink-0 text-xs text-slate-500">
              <div>Total found: {totalItems}</div>

              {page < totalPages && (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-4 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              )}

              <div className="text-[11px] text-slate-400">
                © 2025 PiVisions • www.pivisions.com
              </div>
            </div>
          </>
        ) : activeRail === 'settings' ? (
          /* 1:1 System Application View matching main backend setting .png */
          <div className="p-8 max-w-4xl space-y-6 overflow-y-auto">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Settings</span>
              <span>/</span>
              <span className="text-slate-900 font-bold capitalize">{activeSettingTab}</span>
            </div>

            {activeSettingTab === 'application' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Application name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="CityTourCabs"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Application URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="http://localhost:8090"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="hideControls" className="rounded border-slate-300" />
                  <label htmlFor="hideControls" className="text-xs text-slate-600">
                    Hide collection create and edit controls
                  </label>
                </div>

                <div className="flex justify-end pt-3">
                  <button 
                    onClick={() => showToast('Application settings saved')}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-md cursor-pointer transition"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            )}

            {activeSettingTab === 'admins' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Administrator Accounts</h3>
                  <button 
                    onClick={() => showToast('Admin management active')}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-bold"
                  >
                    + New admin
                  </button>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">citytourcabs8@gmail.com</div>
                      <div className="text-[11px] text-slate-400">Created 2025-11-04 • Super Admin</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">mumbaicitytourcabs@gmail.com</div>
                      <div className="text-[11px] text-slate-400">Created 2025-10-31 • Super Admin</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                  </div>
                </div>
              </div>
            )}

            {activeSettingTab === 'backups' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Database Backups</h3>
                  <button 
                    onClick={() => showToast('Backup created in /data')}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-bold"
                  >
                    + Create backup
                  </button>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-mono font-bold text-slate-800">@auto_pb_backup_city_tour_cabs_20260927000004.zip</div>
                      <div className="text-[11px] text-slate-400">Sep 27, 2026 • 51.4 MB • 2,460 Records</div>
                    </div>
                    <button 
                      onClick={() => showToast('Backup archived safely')}
                      className="px-2.5 py-1 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Logs View matching logs section of api of the backend .png */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="text-slate-900 font-bold text-sm">Logs / API Requests</div>
              <button 
                onClick={() => showToast('Logs refreshed')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-2">
              {[
                { status: 200, method: 'GET', url: '/api/collections/Form_Submissions/records', ip: '127.0.0.1', time: 'Just now' },
                { status: 200, method: 'POST', url: '/api/collections/Form_Submissions/records', ip: '152.59.106.252', time: '12 mins ago' },
                { status: 200, method: 'GET', url: '/api/collections/Tour_Packages/records', ip: '49.36.121.87', time: '34 mins ago' },
                { status: 200, method: 'GET', url: '/api/collections/Settings/records', ip: '127.0.0.1', time: '1 hour ago' },
              ].map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{log.status}</span>
                    <span className="font-bold text-slate-900">{log.method}</span>
                    <span className="text-slate-700">{log.url}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span>{log.ip}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          4. RECORD DRAWER (1:1 with PocketBase Record Editor)
         ======================================================== */}
      {selectedRecord && (
        <aside className="w-[460px] shrink-0 border-l border-slate-200 bg-white shadow-2xl flex flex-col z-40 animate-slideInRight">
          
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Record details</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                {selectedRecord.id || 'New'}
              </span>
            </div>
            <button 
              onClick={() => setSelectedRecord(null)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Lead Follow-up Actions (WhatsApp & Call) */}
          {activeCollection === 'Form_Submissions' && selectedRecord.Phone_Number && (
            <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between gap-2">
              <div className="text-xs font-semibold text-emerald-900">Follow-up:</div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${String(selectedRecord.Whatsapp_Number || selectedRecord.Phone_Number).replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedRecord.Full_Name || 'Sir/Madam')},%20greetings%20from%20City%20Tour%20Cabs!%20Regarding%20your%20inquiry%20for%20${encodeURIComponent(selectedRecord.Destination || 'Tour')}:`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:+91${String(selectedRecord.Phone_Number).replace(/\D/g, '')}`}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {Object.keys(editFormData).map((key) => {
              const val = editFormData[key];
              const isReadOnly = key === 'id' || key === 'created' || key === 'updated';

              return (
                <div key={key} className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 capitalize">
                    {key} {isReadOnly && <span className="text-[10px] text-slate-400 font-normal">(readonly)</span>}
                  </label>

                  {key === 'Type' ? (
                    <select
                      value={val || 'Inquiry'}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-800 outline-none"
                    >
                      <option value="Inquiry">Inquiry</option>
                      <option value="Booking">Booking</option>
                    </select>
                  ) : key === 'Pickup_Address' || key === 'Special_Requirements' || key === 'Content' ? (
                    <textarea
                      rows={3}
                      value={val || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-400"
                    />
                  ) : (
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={val || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                      className={`w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-800 outline-none ${
                        isReadOnly ? 'bg-slate-100 cursor-not-allowed font-mono text-[11px]' : 'bg-slate-50 focus:bg-white focus:border-slate-400'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Drawer Actions */}
          <div className="p-4 border-t border-slate-200 bg-[#f8fafc] flex items-center justify-between">
            <button
              onClick={handleDeleteRecord}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-md text-xs font-bold transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecord}
                className="px-4 py-1.5 bg-[#111827] text-white rounded-md text-xs font-bold hover:bg-slate-800 shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save changes</span>
              </button>
            </div>
          </div>

        </aside>
      )}

      {/* API Preview Modal */}
      {apiPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">API Preview: {activeCollection}</h3>
              <button onClick={() => setApiPreviewOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-500">GET (List/Search):</span>
                <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-md mt-1 overflow-x-auto">
                  curl "http://localhost:3000/api/collections/{activeCollection}/records?perPage=50"
                </div>
              </div>

              <div>
                <span className="text-slate-500">JavaScript SDK:</span>
                <pre className="p-2.5 bg-slate-900 text-indigo-300 rounded-md mt-1 overflow-x-auto text-[11px]">
{`const records = await pb.collection("${activeCollection}").getFullList({
  sort: "-created",
});`}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setApiPreviewOpen(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
