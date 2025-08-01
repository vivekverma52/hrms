import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Edit,
  Eye,
  Trash2,
  Save,
  X,
  Download,
  Upload
} from 'lucide-react';

interface CompanyManagementProps {
}

export const CompanyManagement: React.FC<CompanyManagementProps> = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'clients'>('profile');
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<number | null>(null);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Saudi Aramco',
      type: 'Corporate',
      contractValue: '1.2M SAR',
      status: 'Active',
      expiryDate: '2025-06-15',
      manpower: 45,
      vehicles: 12,
      contactPerson: 'Ahmed Al-Mansouri',
      email: 'ahmed@aramco.com',
      phone: '+966501234567'
    },
    {
      id: 2,
      name: 'SABIC Industries',
      type: 'Government',
      contractValue: '850K SAR',
      status: 'Active',
      expiryDate: '2025-03-20',
      manpower: 32,
      vehicles: 8,
      contactPerson: 'Fatima Al-Zahra',
      email: 'fatima@sabic.com',
      phone: '+966502345678'
    },
    {
      id: 3,
      name: 'NEOM Development',
      type: 'Corporate',
      contractValue: '2.1M SAR',
      status: 'Pending',
      expiryDate: '2025-12-01',
      manpower: 78,
      vehicles: 20,
      contactPerson: 'Mohammad Hassan',
      email: 'mohammad@neom.sa',
      phone: '+966503456789'
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: '',
    type: 'Corporate',
    contractValue: '',
    status: 'Active',
    expiryDate: '',
    manpower: 0,
    vehicles: 0,
    contactPerson: '',
    email: '',
    phone: ''
  });

  const companyInfo = {
    crNumber: '1010123456',
    vatNumber: '300123456789003',
    establishmentDate: '2018-03-15',
    licenseExpiry: '2025-03-15',
    employeeCount: 186,
    vehicleCount: 47,
    activeContracts: 24
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.contractValue) {
      alert('Please fill in required fields');
      return;
    }

    const client = {
      id: clients.length + 1,
      ...newClient
    };

    setClients([...clients, client]);
    setNewClient({
      name: '',
      type: 'Corporate',
      contractValue: '',
      status: 'Active',
      expiryDate: '',
      manpower: 0,
      vehicles: 0,
      contactPerson: '',
      email: '',
      phone: ''
    });
    setShowAddClient(false);
    alert('Client added successfully!');
  };

  const handleEditClient = (id: number) => {
    setEditingClient(id);
  };

  const handleSaveClient = (id: number) => {
    setEditingClient(null);
    alert('Changes saved successfully!');
  };

  const handleDeleteClient = (id: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== id));
      alert('Client deleted successfully!');
    }
  };

  const handleViewClient = (id: number) => {
    const client = clients.find(c => c.id === id);
    alert(`Viewing client details: ${client?.name}`);
  };

  const handleExportClients = () => {
    const csvContent = [
      ['Name', 'Type', 'Contract Value', 'Status', 'Expiry Date', 'Manpower', 'Vehicles', 'Contact Person', 'Email', 'Phone'],
      ...clients.map(client => [
        client.name,
        client.type,
        client.contractValue,
        client.status,
        client.expiryDate,
        client.manpower.toString(),
        client.vehicles.toString(),
        client.contactPerson,
        client.email,
        client.phone
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    alert('Client data exported successfully!');
  };

  const handleImportClients = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const importedClients = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            return {
              id: clients.length + index + 1,
              name: values[0] || '',
              type: values[1] || 'Corporate',
              contractValue: values[2] || '',
              status: values[3] || 'Active',
              expiryDate: values[4] || '',
              manpower: parseInt(values[5]) || 0,
              vehicles: parseInt(values[6]) || 0,
              contactPerson: values[7] || '',
              email: values[8] || '',
              phone: values[9] || ''
            };
          }).filter(client => client.name);
          
          setClients([...clients, ...importedClients]);
          alert(`Successfully imported ${importedClients.length} clients!`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Company & Client Management
          </h1>
          <p className="text-gray-600">
            Manage company profile and client relationships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportClients}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Clients
          </button>
          <button
            onClick={handleImportClients}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import Clients
          </button>
          <button
            onClick={() => setShowAddClient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Company Profile
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'clients'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Clients
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Company Profile
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CR Number
                  </label>
                  <p className="text-gray-900 font-medium">{companyInfo.crNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Number
                  </label>
                  <p className="text-gray-900 font-medium">{companyInfo.vatNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Establishment Date
                  </label>
                  <p className="text-gray-900 font-medium">{companyInfo.establishmentDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Expiry
                  </label>
                  <p className="text-gray-900 font-medium">{companyInfo.licenseExpiry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Company Statistics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-900">{companyInfo.employeeCount}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Vehicles</p>
                  <p className="text-2xl font-bold text-green-900">{companyInfo.vehicleCount}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Active Contracts</p>
                  <p className="text-2xl font-bold text-purple-900">{companyInfo.activeContracts}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Clients
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">{client.contactPerson}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {client.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.contractValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.expiryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClient(client.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClient(client.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Client
              </h3>
              <button 
                onClick={() => setShowAddClient(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newClient.type}
                    onChange={(e) => setNewClient({...newClient, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Value
                  </label>
                  <input
                    type="text"
                    value={newClient.contractValue}
                    onChange={(e) => setNewClient({...newClient, contractValue: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 1.2M SAR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({...newClient, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newClient.expiryDate}
                    onChange={(e) => setNewClient({...newClient, expiryDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={newClient.contactPerson}
                    onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+966501234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manpower Required
                  </label>
                  <input
                    type="number"
                    value={newClient.manpower}
                    onChange={(e) => setNewClient({...newClient, manpower: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicles Required
                  </label>
                  <input
                    type="number"
                    value={newClient.vehicles}
                    onChange={(e) => setNewClient({...newClient, vehicles: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddClient(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClient}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};