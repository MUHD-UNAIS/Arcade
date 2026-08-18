import React from 'react';

const ResourceWallet = ({
    isOpen,
    resources,
    onSelectResource,
    selectedResource
}) => {

    const allResources = [
        ...(resources?.helplines || []).map(resource => ({
            id: 'hotline',
            name: resource.name,
            description: resource.desc,
            category: 'Helpline',
            details: `${resource.phone} • ${resource.hours}`
        })),

        ...(resources?.counselors || []).map(resource => ({
            id: 'counselor',
            name: resource.name,
            description: resource.desc,
            category: 'Counselor',
            details: `${resource.location} • ${resource.contact}`
        })),

        ...(resources?.hospitals || []).map(resource => ({
            id: 'hospital',
            name: resource.name,
            description: resource.type || resource.dept,
            category: 'Hospital',
            details: `${resource.location} • ${resource.contact}`
        })),

        ...(resources?.selfcare || []).map(resource => ({
            id: 'selfcare',
            name: resource.title,
            description: resource.tip,
            category: 'Self-Care',
            details: ''
        }))
    ];

    return (
        <div
            className={`resource-wallet ${
                isOpen ? 'open' : ''
            } shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col bg-slate-50`}
        >

            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">

                    <h3 className="text-sm uppercase flex items-center gap-2 tracking-[0.2em] font-black text-slate-800">
                        <svg
                            className="w-5 h-5 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>

                        Resource Toolkit
                    </h3>

                    <div className="px-2 py-1 bg-teal-100 text-teal-800 text-[10px] font-bold rounded uppercase tracking-wide">
                        {allResources.length} Available
                    </div>
                </div>

                <p className="text-[10px] text-slate-500 font-medium">
                    Select a resource to refer the person in crisis.
                </p>
            </div>

            {/* Resources */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3">

                    {allResources.map((resource) => {

                        let icon;

                        if (resource.category === 'Helpline') {
                            icon = (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.515l.6 2.4a2 2 0 01-.45 1.86l-1.2 1.2a16 16 0 006.36 6.36l1.2-1.2a2 2 0 011.86-.45l2.4.6A2 2 0 0121 17.28V20a2 2 0 01-2 2C9.61 22 2 14.39 2 5a2 2 0 012-2z"
                                    />
                                </svg>
                            );
                        } else if (resource.category === 'Hospital') {
                            icon = (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M12 2v20M2 12h20"
                                    />
                                </svg>
                            );
                        } else {
                            icon = (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            );
                        }

                        const isSelected =
                            selectedResource === resource.id;

                        return (
                            <div
                                    key={`${resource.category}-${resource.name}`}
                                onClick={() =>
                                    onSelectResource(resource.id)
                                }
                                className={`group relative p-4 rounded-xl transition-all duration-200 border-2 cursor-pointer flex items-start gap-4 ${
                                    isSelected
                                        ? 'bg-white border-teal-500 shadow-lg translate-x-1'
                                        : 'bg-white border-slate-100 hover:border-teal-300 hover:shadow-md'
                                }`}
                            >

                                {/* Icon */}
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        isSelected
                                            ? 'bg-teal-100 text-teal-700'
                                            : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50'
                                    }`}
                                >
                                    {icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">

                                    <div className="flex justify-between items-start">

                                        <h4
                                            className={`text-sm font-black uppercase tracking-wide pr-2 ${
                                                isSelected
                                                    ? 'text-teal-900'
                                                    : 'text-slate-800'
                                            }`}
                                        >
                                            {resource.name}
                                        </h4>

                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded uppercase tracking-wider">
                                            {resource.category}
                                        </span>

                                    </div>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isSelected
                                                ? 'max-h-32 opacity-100 mt-2'
                                                : 'max-h-0 opacity-0 mt-0'
                                        }`}
                                    >

                                        <p className="text-xs leading-normal font-medium text-teal-700">
                                            {resource.description}
                                        </p>

                                        {resource.details && (
                                            <p className="mt-2 text-[10px] font-bold text-slate-500">
                                                {resource.details}
                                            </p>
                                        )}

                                    </div>

                                </div>

                                {isSelected && (
                                    <div className="absolute inset-y-0 right-0 w-1.5 bg-teal-500 rounded-r-xl" />
                                )}

                            </div>
                        );
                    })}

                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <p className="text-[10px] text-teal-800 leading-relaxed font-bold italic text-center">
                    "Connect them to help. Select the resource Sam needs most right now."
                </p>
            </div>

        </div>
    );
};

export default ResourceWallet;