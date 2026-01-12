import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { companionsApi } from '../../api/companions';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 10;

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

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'companions', label: 'Companions' },
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
                        <p className="text-gray-500 mt-1">Manage platform activity and companions.</p>
                    </div>
                    <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                        Logout
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 max-w-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200',
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
                {loading ? (
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
