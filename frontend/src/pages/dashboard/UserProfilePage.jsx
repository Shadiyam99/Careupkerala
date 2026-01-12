import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api/users';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserProfilePage = () => {
    const { logout } = useAuth();
    const { success, error: toastError } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        country: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getProfile();
            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                phone: data.phone || '',
                country: data.country || '',
            });
        } catch (err) {
            toastError('Failed to load profile. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedProfile = await usersApi.updateProfile(formData);
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

    if (loading && !profile) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                        Logout
                    </Button>
                </div>

                {/* Error handled by toast */}

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                            <Button
                                variant={isEditing ? "ghost" : "outline"}
                                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                {isEditing ? (
                                    <Input
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="text-gray-900 text-lg">{profile?.full_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <p className="text-gray-500 text-lg">{profile?.email}</p>
                                <span className="text-xs text-gray-400">Email cannot be changed</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                {isEditing ? (
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="text-gray-900 text-lg">{profile?.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                {isEditing ? (
                                    <Input
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="text-gray-900 text-lg">{profile?.country || 'Not set'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Role</label>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                    {profile?.role}
                                </span>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button onClick={handleSave} isLoading={loading}>
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfilePage;
