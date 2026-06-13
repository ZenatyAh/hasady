import type React from 'react';

type FarmRegisterUploadProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileName: string;
  fileSize: string;
  isEdit: boolean;
  errors: Record<string, string>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: (e: React.MouseEvent) => void;
};

export function FarmRegisterUpload({
  fileInputRef,
  fileName,
  fileSize,
  isEdit,
  errors,
  onFileChange,
  onClearFile,
}: FarmRegisterUploadProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="farm-register" className="text-sm font-bold text-[#111111]">
        السجل الزراعي
      </label>
      <input
        id="farm-register"
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        className="sr-only"
        aria-invalid={Boolean(errors.file)}
        aria-describedby={errors.file ? 'farm-register-error' : undefined}
      />

      <label
        htmlFor="farm-register"
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition hover:bg-[#faf8f5]/60 focus-within:ring-4 focus-within:ring-[#97cda6] ${
          errors.file ? 'border-red-500 bg-red-50/20' : 'border-[#e0e0e0] bg-[#fdfcfa]/50'
        }`}
      >
        {fileName ? (
          <span className="flex flex-col items-center space-y-2">
            <span className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8f1eb] text-[#265C38]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#111111] max-w-[180px] truncate">
                {fileName}
              </span>
              <button
                type="button"
                onClick={onClearFile}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                aria-label={`إزالة ${fileName}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
            <span className="text-[10px] text-gray-400 font-medium">{fileSize}</span>
          </span>
        ) : (
          <span className="flex flex-col items-center space-y-2.5">
            <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-[#e8f1eb] text-[#265C38]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </span>
            <span className="text-xs font-medium text-[#888888]">
              {isEdit ? 'رفع سجل زراعي جديد' : 'رفع الملف'}
            </span>
          </span>
        )}
      </label>
      {errors.file && (
        <p id="farm-register-error" className="text-xs text-red-500">
          {errors.file}
        </p>
      )}
    </div>
  );
}
