import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1F2937] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[15px] text-[#6B7280] mt-1 leading-normal">
            {description}
          </p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="border-b border-[#E5E7EB] mt-6" />
    </div>
  );
}
