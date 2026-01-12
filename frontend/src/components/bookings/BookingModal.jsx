import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { hospitalsApi } from '../../api/hospitals';
import { bookingsApi } from '../../api/bookings';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export function BookingModal({ isOpen, onClose, service }) {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        hospital_id: '',
        scheduled_date: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchHospitals();
            // Reset form
            setFormData({
                hospital_id: '',
                scheduled_date: ''
            });
        }
    }, [isOpen]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const data = await hospitalsApi.getAll();
            setHospitals(data || []);
        } catch (err) {
            console.error(err);
            toastError('Failed to load hospitals');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toastError('Please login to book a service');
            return;
        }

        if (!service.pricing || service.pricing.length === 0) {
            toastError('This service has no active pricing');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                service_id: service.id,
                pricing_id: service.pricing[0].id, // Assuming single pricing for now
                hospital_id: formData.hospital_id,
                scheduled_date: new Date(formData.scheduled_date).toISOString()
            };

            await bookingsApi.create(payload);
            success('Booking request sent successfully!');
            onClose();
        } catch (err) {
            console.error(err);
            toastError(err.response?.data?.detail || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (!service) return null;

    const price = service.pricing && service.pricing.length > 0 ? service.pricing[0] : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Book ${service.name}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service:</span>
                        <span className="font-medium text-gray-900">{service.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-accent">
                            {price ? `${price.currency} ${price.price}` : 'Price not available'}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hospital
                    </label>
                    <select
                        required
                        value={formData.hospital_id}
                        onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loading}
                    >
                        <option value="">-- Choose a Hospital --</option>
                        {hospitals.map((hospital) => (
                            <option key={hospital.id} value={hospital.id}>
                                {hospital.name} ({hospital.location})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date & Time
                    </label>
                    <Input
                        required
                        type="datetime-local"
                        value={formData.scheduled_date}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full bg-white border-gray-200 focus:ring-accent"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="mr-2">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting || loading || !price}
                        className="w-full sm:w-auto"
                    >
                        {submitting ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
