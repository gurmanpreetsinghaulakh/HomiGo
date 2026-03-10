import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'info', 'success', 'error', 'confirm', 'warning', 'delete'
        onConfirm: null,
        onCancel: null,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isLoading: false,
    });

    const showModal = useCallback((options) => {
        setModal({
            isOpen: true,
            title: options.title || 'Notification',
            message: options.message || '',
            type: options.type || 'info',
            onConfirm: options.onConfirm || null,
            onCancel: options.onCancel || null,
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            isLoading: false,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const setModalLoading = useCallback((isLoading) => {
        setModal(prev => ({ ...prev, isLoading }));
    }, []);

    return (
        <ModalContext.Provider value={{ modal, showModal, closeModal, setModalLoading }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useGlobalModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useGlobalModal must be used within a ModalProvider');
    }
    return context;
};
