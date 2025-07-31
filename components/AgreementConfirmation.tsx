
import React, { useState } from 'react';

interface AgreementConfirmationProps {
    onAgree: () => void;
    onCancel: () => void;
    title: string;
    children: React.ReactNode;
}

export const AgreementConfirmation: React.FC<AgreementConfirmationProps> = ({ onAgree, onCancel, title, children }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="flex flex-col animate-fade-in-up">
            <h3 className="text-lg font-bold text-dark-text">{title}</h3>
            <div className="my-4 p-4 bg-light-gray rounded-lg max-h-48 overflow-y-auto border border-gray-200 text-sm text-gray-600 space-y-2">
                {children}
            </div>
            <div className="flex items-center space-x-3 mt-2">
                <input
                    type="checkbox"
                    id="agreement-checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-primary-blue focus:ring-primary-blue/50"
                    aria-labelledby="agreement-label"
                />
                <label id="agreement-label" htmlFor="agreement-checkbox" className="text-sm text-gray-700">
                    I have read and agree to the terms and conditions.
                </label>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                <button
                    onClick={onAgree}
                    disabled={!isChecked}
                    className="w-full sm:w-auto bg-primary-blue text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Agree &amp; Continue
                </button>
                <button
                    onClick={onCancel}
                    className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
