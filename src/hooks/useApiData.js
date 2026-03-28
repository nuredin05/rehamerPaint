import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Custom hook for managing API data with loading, error states
export const useApiData = (apiFunction, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Custom hook for CRUD operations
export const useCrudOperations = (apiEndpoints) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiEndpoints.create(data);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiEndpoints.create]);

  const update = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiEndpoints.update(id, data);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiEndpoints.update]);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await apiEndpoints.delete(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiEndpoints.delete]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiEndpoints.updateStatus(id, status);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiEndpoints.updateStatus]);

  return { create, update, remove, updateStatus, loading, error };
};

// Custom hook for notifications
export const useNotification = () => {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({ show: false, message: '', type: 'success' });
  }, []);

  return { notification, showNotification, hideNotification };
};

// Custom hook for search/filter functionality
export const useSearchFilter = (data, searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    return searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return { searchTerm, setSearchTerm, filteredData };
};

// Custom hook for modal management
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = useCallback((item = null) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  return { isOpen, selectedItem, openModal, closeModal };
};

// Custom hook for form management
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when value changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setValuesBatch = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validate = useCallback((validationRules) => {
    const newErrors = {};
    
    Object.entries(validationRules).forEach(([field, rule]) => {
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = `${field} is required`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} is invalid`;
      } else if (rule.min && value.length < rule.min) {
        newErrors[field] = `${field} must be at least ${rule.min} characters`;
      } else if (rule.max && value.length > rule.max) {
        newErrors[field] = `${field} must not exceed ${rule.max} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return {
    values,
    errors,
    setValue,
    setValuesBatch,
    setError,
    clearErrors,
    reset,
    validate
  };
};
