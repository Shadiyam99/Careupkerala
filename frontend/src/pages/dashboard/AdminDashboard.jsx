import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { companionsApi } from '../../api/companions';
import { hospitalsApi } from '../../api/hospitals';
import { servicesApi } from '../../api/services';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const { success, error: toastError } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [pendingCompanions, setPendingCompanions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Hospital Modal State
    const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
    const [currentHospital, setCurrentHospital] = useState(null);
    const [hospitalForm, setHospitalForm] = useState({
        name: '',
        location: '',
        address: '',
        phone: ''
    });

    // Service Modal State
    const [services, setServices] = useState([]);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        description: '',
        is_active: true
    });

    // Pricing Modal State
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [pricingForm, setPricingForm] = useState({
        price: '',
        currency: 'INR'
    });
    const [currentServicePricing, setCurrentServicePricing] = useState(null); // The service we are adding pricing for
    const [editingPricingId, setEditingPricingId] = useState(null); // The specific pricing ID if editing


    useEffect(() => {
        setPage(1); // Reset page on tab change
        loadData(1); // Load first page
    }, [activeTab]);

    useEffect(() => {
        if (page > 1) {
            loadData(page);
        }
    }, [page]);

    const loadData = async (currentPage = 1) => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const data = await adminApi.getOverview();
                setStats(data);
            } else if (activeTab === 'companions') {
                const data = await companionsApi.getPendingCompanions(currentPage, ITEMS_PER_PAGE);
                setPendingCompanions(data.companions || []);
                setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
            } else if (activeTab === 'logs') {
                const data = await adminApi.getLogs(currentPage, ITEMS_PER_PAGE);
                setLogs(data.logs || []);
                setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
            } else if (activeTab === 'hospitals') {
                const data = await hospitalsApi.getAll();
                setHospitals(data || []);
                setTotalPages(1); // Hospitals not paginated yet
            } else if (activeTab === 'services') {
                const data = await servicesApi.getAll();
                setServices(data || []);
                setTotalPages(1); // Services not paginated yet
            }
        } catch (err) {
            console.error(err);
            toastError('Failed to load data. Ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await companionsApi.approveCompanion(id);
            // Refresh list
            loadData(page);
            success('Companion approved successfully.');
        } catch (err) {
            console.error(err);
            toastError('Failed to approve companion.');
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await companionsApi.deactivateCompanion(id);
            // Refresh list
            loadData(page);
            success('Companion rejected/deactivated.');
        } catch (err) {
            console.error(err);
            toastError('Failed to deactivate companion.');
        }
    };

    // Hospital Handlers
    const handleAddHospital = () => {
        setCurrentHospital(null);
        setHospitalForm({ name: '', location: '', address: '', phone: '' });
        setIsHospitalModalOpen(true);
    };

    const handleEditHospital = (hospital) => {
        setCurrentHospital(hospital);
        setHospitalForm({
            name: hospital.name,
            location: hospital.location,
            address: hospital.address,
            phone: hospital.phone
        });
        setIsHospitalModalOpen(true);
    };

    // Confirmation Modal State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmTitle, setConfirmTitle] = useState('Confirm Action');
    const [confirmMessage, setConfirmMessage] = useState('Are you sure you want to perform this action?');

    const handleSaveHospital = async (e) => {
        e.preventDefault();
        try {
            if (currentHospital) {
                await hospitalsApi.update(currentHospital.id, hospitalForm);
                success('Hospital updated successfully');
            } else {
                await hospitalsApi.create(hospitalForm);
                success('Hospital created successfully');
            }
            setIsHospitalModalOpen(false);
            loadData(page);
        } catch (err) {
            console.error(err);
            toastError('Failed to save hospital');
        }
    };



    const handleDeleteHospital = (id) => {
        confirmDelete(() => async () => {
            try {
                await hospitalsApi.delete(id);
                success('Hospital deleted successfully');
                loadData(page);
            } catch (err) {
                console.error(err);
                toastError('Failed to delete hospital');
            }
        }, 'Delete Hospital', 'Are you sure you want to delete this hospital? This action cannot be undone.');
    };

    const confirmDelete = (action, title, message) => {
        setConfirmAction(action);
        setConfirmTitle(title);
        setConfirmMessage(message);
        setIsConfirmOpen(true);
    };

    // Service Handlers
    const handleAddService = () => {
        setCurrentService(null);
        setServiceForm({ name: '', description: '', is_active: true });
        setIsServiceModalOpen(true);
    };

    const handleEditService = (service) => {
        setCurrentService(service);
        setServiceForm({
            name: service.name,
            description: service.description,
            is_active: service.is_active
        });
        setIsServiceModalOpen(true);
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        try {
            if (currentService) {
                await servicesApi.update(currentService.id, serviceForm);
                success('Service updated successfully');
            } else {
                await servicesApi.create(serviceForm);
                success('Service created successfully');
            }
            setIsServiceModalOpen(false);
            loadData(page);
        } catch (err) {
            console.error(err);
            toastError('Failed to save service');
        }
    };

    const handleDeleteService = (id) => {
        confirmDelete(() => async () => {
            try {
                await servicesApi.delete(id);
                success('Service deleted successfully');
                loadData(page);
            } catch (err) {
                console.error(err);
                toastError('Failed to delete service');
            }
        }, 'Delete Service', 'Are you sure you want to delete this service?');
    };

    const handleOpenPricing = (service) => {
        setCurrentServicePricing(service);
        // Check if service already has pricing (assuming single active pricing or taking the first one for now)
        if (service.pricing && service.pricing.length > 0) {
            const priceData = service.pricing[0];
            setPricingForm({ price: priceData.price, currency: priceData.currency });
            setEditingPricingId(priceData.id);
        } else {
            setPricingForm({ price: '', currency: 'INR' });
            setEditingPricingId(null);
        }
        setIsPricingModalOpen(true);
    };

    const handleSavePricing = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...pricingForm,
                service_id: currentServicePricing.id
            };

            if (editingPricingId) {
                await servicesApi.updatePricing(editingPricingId, { price: pricingForm.price, currency: pricingForm.currency });
                success('Pricing updated successfully');
            } else {
                await servicesApi.addPricing(payload);
                success('Pricing added successfully');
            }
            setIsPricingModalOpen(false);
            loadData(page);
        } catch (err) {
            console.error(err);
            toastError('Failed to save pricing');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'companions', label: 'Companions' },
        { id: 'hospitals', label: 'Hospitals' },
        { id: 'services', label: 'Services' },
        { id: 'logs', label: 'Activity Logs' },
    ];

    const PaginationControls = () => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center items-center space-x-4 mt-6">
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span className="text-gray-600 font-medium">
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage platform activity, companions, and hospitals.</p>
                    </div>
                    <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                        Logout
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 max-w-xl overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 whitespace-nowrap px-4',
                                activeTab === tab.id
                                    ? 'bg-white text-primary shadow'
                                    : 'text-gray-600 hover:bg-white/12 hover:text-primary'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Error handled by toast */}

                {/* Content */}
                {loading && !hospitals.length && !pendingCompanions.length && !logs.length && !stats ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && stats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                                        <p className="text-3xl font-bold text-primary mt-2">{stats.total_nri_users}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                                        <p className="text-3xl font-bold text-primary mt-2">{stats.total_bookings}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <p className="text-sm font-medium text-gray-500">Total Companions</p>
                                        <p className="text-3xl font-bold text-primary mt-2">{stats.total_companions}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-yellow-50 border-yellow-100">
                                    <CardContent className="p-6">
                                        <p className="text-sm font-medium text-yellow-700">Pending Approvals</p>
                                        <p className="text-3xl font-bold text-yellow-800 mt-2">{stats.pending_companions}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Companions Tab */}
                        {activeTab === 'companions' && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-bold text-gray-900">Pending Approvals ({pendingCompanions.length})</h3>
                                </CardHeader>
                                <CardContent>
                                    {pendingCompanions.length === 0 ? (
                                        <p className="text-gray-500 py-4 text-center">No pending companions found.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {pendingCompanions.map((companion) => (
                                                        <tr key={companion.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{companion.full_name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{companion.email}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{companion.phone}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(companion.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                                <button
                                                                    onClick={() => handleApprove(companion.id)}
                                                                    className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-full transition-colors"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeactivate(companion.id)}
                                                                    className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-full transition-colors"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <PaginationControls />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Hospitals Tab */}
                        {activeTab === 'hospitals' && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">Registered Hospitals</h3>
                                    <Button onClick={handleAddHospital} size="sm">
                                        + Add Hospital
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {hospitals.length === 0 ? (
                                        <p className="text-gray-500 py-4 text-center">No hospitals registered yet.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {hospitals.map((hospital) => (
                                                        <tr key={hospital.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hospital.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.location}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.phone}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={hospital.address}>{hospital.address}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        onClick={() => handleEditHospital(hospital)}
                                                                        variant="secondary"
                                                                        size="sm"
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleDeleteHospital(hospital.id)}
                                                                        variant="danger"
                                                                        size="sm"
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Logs Tab */}
                        {activeTab === 'logs' && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-bold text-gray-900">System Activity Logs</h3>
                                </CardHeader>
                                <CardContent>
                                    {logs.length === 0 ? (
                                        <p className="text-gray-500 py-4 text-center">No logs found.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {logs.map((log) => (
                                                        <tr key={log.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(log.created_at).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                    {log.action_type}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                                                {log.description}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {log.entity_type}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <PaginationControls />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">Services</h3>
                                    <Button onClick={handleAddService} size="sm">
                                        + Add Service
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {services.length === 0 ? (
                                        <p className="text-gray-500 py-4 text-center">No services found.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {services.map((service) => (
                                                        <tr key={service.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{service.description}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {service.pricing && service.pricing.length > 0 ? (
                                                                    `${service.pricing[0].currency} ${service.pricing[0].price}`
                                                                ) : (
                                                                    <span className="text-gray-400 italic">No price</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={cn(
                                                                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                                    service.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                )}>
                                                                    {service.is_active ? "Active" : "Inactive"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        onClick={() => handleEditService(service)}
                                                                        variant="secondary"
                                                                        size="sm"
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleOpenPricing(service)}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                                    >
                                                                        Pricing
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleDeleteService(service.id)}
                                                                        variant="danger"
                                                                        size="sm"
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}


                {/* Hospital Modal */}
                <Modal
                    isOpen={isHospitalModalOpen}
                    onClose={() => setIsHospitalModalOpen(false)}
                    title={currentHospital ? 'Edit Hospital' : 'Add New Hospital'}
                >
                    <form onSubmit={handleSaveHospital} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                            <Input
                                required
                                value={hospitalForm.name}
                                onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                                placeholder="e.g. City General Hospital"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <Input
                                required
                                value={hospitalForm.location}
                                onChange={(e) => setHospitalForm({ ...hospitalForm, location: e.target.value })}
                                placeholder="e.g. Kochi, Kerala"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input
                                required
                                value={hospitalForm.phone}
                                onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                                placeholder="e.g. +91 9876543210"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                required
                                value={hospitalForm.address}
                                onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-gray-50"
                                rows={3}
                                placeholder="Enter full address"
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">
                                {currentHospital ? 'Update Hospital' : 'Add Hospital'}
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={confirmAction}
                    title={confirmTitle}
                    message={confirmMessage}
                    confirmText="Delete"
                    variant="danger"
                />

                {/* Service Modal */}
                <Modal
                    isOpen={isServiceModalOpen}
                    onClose={() => setIsServiceModalOpen(false)}
                    title={currentService ? 'Edit Service' : 'Add New Service'}
                >
                    <form onSubmit={handleSaveService} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                            <Input
                                required
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                placeholder="e.g. Elderly Care"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-gray-50"
                                rows={3}
                                placeholder="Enter service description"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={serviceForm.is_active}
                                onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                Active Service
                            </label>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">
                                {currentService ? 'Update Service' : 'Add Service'}
                            </Button>
                        </div>
                    </form>
                </Modal>
                {/* Pricing Modal */}
                <Modal
                    isOpen={isPricingModalOpen}
                    onClose={() => setIsPricingModalOpen(false)}
                    title={`Manage Pricing - ${currentServicePricing?.name || ''}`}
                >
                    <form onSubmit={handleSavePricing} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <Input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={pricingForm.price}
                                onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                                placeholder="e.g. 500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                value={pricingForm.currency}
                                onChange={(e) => setPricingForm({ ...pricingForm, currency: e.target.value })}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 bg-gray-50"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">
                                Save Pricing
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default AdminDashboard;
