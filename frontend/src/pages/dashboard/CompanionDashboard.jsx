import React, { useState, useEffect } from 'react';
import { companionsApi } from '../../api/companions';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CompanionDashboard = () => {
    const { logout } = useAuth();
    const { success, error: toastError } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        phone: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setEditForm({
                full_name: profile.full_name || '',
                phone: profile.phone || ''
            });
        }
    }, [profile]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await companionsApi.getMyProfile();
            setProfile(data);
        } catch (err) {
            toastError('Failed to load companion profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const updatedProfile = await companionsApi.updateProfile(editForm);
            setProfile(updatedProfile);
            setIsEditing(false);
            success('Profile updated successfully!');
        } catch (err) {
            toastError('Failed to update profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async () => {
        try {
            setLoading(true);
            const newStatus = profile.availability_status === 'available' ? 'unavailable' : 'available';
            const updatedProfile = await companionsApi.updateAvailability(newStatus);
            setProfile(updatedProfile);
            success(`You are now ${newStatus === 'available' ? 'Online' : 'Offline'}`);
        } catch (err) {
            toastError('Failed to update availability.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Companion Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your availability and view your profile.</p>
                    </div>
                    <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                        Logout
                    </Button>
                </div>

                {/* Error handled by toast */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Status Card */}
                    <Card className="col-span-1 md:col-span-1 border-t-4 border-t-accent">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Current Status</h3>
                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${profile?.availability_status === 'available'
                                ? 'bg-green-100 text-green-600 ring-4 ring-green-50'
                                : 'bg-gray-100 text-gray-400 ring-4 ring-gray-50'
                                }`}>
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold mb-6 capitalize text-gray-900">
                                {profile?.availability_status || 'Unavailable'}
                            </p>
                            <Button
                                onClick={toggleAvailability}
                                className={profile?.availability_status === 'available' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white w-full'}
                            >
                                {profile?.availability_status === 'available' ? 'Go Offline' : 'Go Online'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Profile Details */}
                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">My Details</h3>
                            <Button
                                variant="ghost"
                                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                className="text-sm text-primary hover:text-primary-dark"
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.full_name}
                                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{profile?.full_name}</p>
                                    )}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-gray-900">{profile?.email}</p>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile?.phone}</p>
                                    )}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-500">Account Status</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile?.status ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {profile?.status ? 'Active' : 'Pending Approval'}
                                    </span>
                                </div>
                            </div>
                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditForm({ full_name: profile?.full_name || '', phone: profile?.phone || '' });
                                        }}
                                        className="text-gray-500 hover:text-gray-700 mr-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateProfile}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CompanionDashboard;
