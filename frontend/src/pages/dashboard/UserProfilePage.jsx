import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api/users';
import { bookingsApi } from '../../api/bookings';
import { servicesApi } from '../../api/services';
import { paymentsApi } from '../../api/payments';
import { BookingModal } from '../../components/bookings/BookingModal';
import { PaymentModal } from '../../components/payments/PaymentModal';
import { CareFeedModal } from '../../components/care-feed/CareFeedModal';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, MapPin, CreditCard, ChevronRight, CheckCircle, AlertCircle, User } from 'lucide-react';

const UserProfilePage = () => {
    const { logout } = useAuth();
    const { success, error: toastError } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState('profile'); // profile, bookings, services
    const [myBookings, setMyBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Care Feed State
    const [selectedBookingForFeed, setSelectedBookingForFeed] = useState(null);
    const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        country: '',
    });

    useEffect(() => {
        loadProfile();
        loadBookings();
        loadServices();
        loadPayments();
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
            toastError('Failed to load profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadBookings = async () => {
        try {
            const data = await bookingsApi.getMyBookings();
            setMyBookings(data || []);
        } catch (err) {
            console.error("Failed to load bookings", err);
        }
    };

    const loadServices = async () => {
        try {
            const data = await servicesApi.getAll();
            setServices(data || []);
        } catch (err) {
            console.error("Failed to load services", err);
        }
    };

    const loadPayments = async () => {
        try {
            const data = await paymentsApi.getMyPayments();
            setPayments(data || []);
        } catch (err) {
            console.error("Failed to load payments", err);
        }
    };

    const handleBookNow = (service) => {
        setSelectedService(service);
        setIsBookingModalOpen(true);
    };

    const handlePayNow = (booking) => {
        setSelectedBookingForPayment(booking);
        setIsPaymentModalOpen(true);
    };

    const handleOpenFeed = (booking) => {
        setSelectedBookingForFeed(booking);
        setIsFeedModalOpen(true);
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
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <Button variant="outline" onClick={logout} className="text-red-600 border-red-200 hover:bg-red-50">
                        Logout
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-gray-200 p-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                            ${activeTab === 'profile' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-white/12 hover:text-primary'}
                        `}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                            ${activeTab === 'bookings' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-white/12 hover:text-primary'}
                        `}
                    >
                        My Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                            ${activeTab === 'services' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-white/12 hover:text-primary'}
                        `}
                    >
                        Book a Service
                    </button>
                </div>

                {/* Error handled by toast */}

                {activeTab === 'profile' && (
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
                )}

                {/* My Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="bg-white rounded-lg shadow-sm min-h-[400px] p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
                        {myBookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center text-gray-500">
                                    You haven't made any bookings yet. Check out the "Book a Service" tab!
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {myBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                        {booking.companion_name && (
                                                            <span className="flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
                                                                <User className="w-3 h-3 mr-1" />
                                                                {booking.companion_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{booking.service_name}</h3>
                                                    <div className="flex items-center text-gray-500 mt-1 text-sm">
                                                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                        {booking.hospital_name}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end justify-center">
                                                    <div className="text-2xl font-bold text-gray-900">{booking.currency} {booking.price}</div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total Amount</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-gray-100 border-b mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                                                        <Calendar className="w-4 h-4 text-zinc-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium uppercase">Date</div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {new Date(booking.scheduled_date).toLocaleDateString('en-IN', {
                                                                timeZone: 'Asia/Kolkata',
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                                                        <Clock className="w-4 h-4 text-zinc-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium uppercase">Time</div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {new Date(booking.scheduled_date).toLocaleTimeString('en-IN', {
                                                                timeZone: 'Asia/Kolkata',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                                                        <CreditCard className="w-4 h-4 text-zinc-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 font-medium uppercase">Payment</div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {(() => {
                                                                const payment = payments.find(p => p.booking_id === booking.id);
                                                                if (payment) return <span className={payment.status === 'paid' ? "text-emerald-600" : "text-amber-600"}>{payment.status === 'paid' ? 'Paid' : 'Pending'}</span>;
                                                                return <span className="text-gray-400">Not Initiated</span>;
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-end gap-3">
                                                {(booking.status === 'assigned' || booking.status === 'completed') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenFeed(booking)}
                                                        className="text-gray-600 hover:text-zinc-900 hover:bg-zinc-100"
                                                    >
                                                        View Updates
                                                    </Button>
                                                )}

                                                {(() => {
                                                    const payment = payments.find(p => p.booking_id === booking.id);
                                                    if (payment) {
                                                        if (payment.status === 'paid') {
                                                            return (
                                                                <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                                    <CheckCircle className="w-4 h-4 mr-1.5" />
                                                                    Payment Complete
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                                    <AlertCircle className="w-4 h-4 mr-1.5" />
                                                                    Payment {payment.status}
                                                                </div>
                                                            );
                                                        }
                                                    } else if (booking.status !== 'cancelled') {
                                                        return (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handlePayNow(booking)}
                                                                className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-md hover:shadow-lg transition-all"
                                                            >
                                                                Pay Now <ChevronRight className="w-4 h-4 ml-1" />
                                                            </Button>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 px-1">Available Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.filter(s => s.is_active).map((service) => (
                                <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                                        <p className="text-gray-600 mb-4 flex-1">{service.description}</p>
                                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase">Starts from</span>
                                                <div className="text-lg font-bold text-accent">
                                                    {service.pricing && service.pricing.length > 0
                                                        ? `${service.pricing[0].currency} ${service.pricing[0].price}`
                                                        : 'Contact us'}
                                                </div>
                                            </div>
                                            <Button onClick={() => handleBookNow(service)}>
                                                Book Now
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => {
                        setIsBookingModalOpen(false);
                        loadBookings(); // Refresh bookings after close
                    }}
                    service={selectedService}
                />

                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    booking={selectedBookingForPayment}
                    onPaymentSuccess={() => {
                        loadPayments();
                    }}
                />
                {/* Care Feed Modal */}
                <CareFeedModal
                    isOpen={isFeedModalOpen}
                    onClose={() => setIsFeedModalOpen(false)}
                    booking={selectedBookingForFeed}
                />
            </div>
        </div>
    );
};

export default UserProfilePage;
