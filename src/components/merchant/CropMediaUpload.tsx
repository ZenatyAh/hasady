import type React from 'react';

type CropMediaUploadProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageNames: string[];
  errors: Record<string, string>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: (index: number, e: React.MouseEvent) => void;
};

export function CropMediaUpload({
  fileInputRef,
  imageNames,
  errors,
  onFileChange,
  onClearImage,
}: CropMediaUploadProps) {
  return (
    <div className="space-y-1.5 md:col-span-2">
      <label htmlFor="crop-media" className="text-sm font-bold text-[#111111]">
        صور وفيديو المنتج
      </label>
      <input
        id="crop-media"
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        multiple
        accept="image/*,video/*"
        className="sr-only"
        aria-invalid={Boolean(errors.images)}
        aria-describedby={errors.images ? 'crop-media-error' : undefined}
      />

      <label
        htmlFor="crop-media"
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition hover:bg-[#faf8f5]/60 focus-within:ring-4 focus-within:ring-[#97cda6] ${
          errors.images ? 'border-red-500 bg-red-50/20' : 'border-[#e0e0e0] bg-[#fdfcfa]/50'
        }`}
      >
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
          <span className="text-xs font-bold text-[#888888]">رفع صور للمنتج</span>
          <span className="text-[10px] text-gray-400">
            ملاحظة: يجب رفع صورة واحدة على الأقل للمنتج
          </span>
        </span>
      </label>

      {imageNames.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {imageNames.map((name, idx) => (
            <div
              key={`${name}-${idx}`}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-[#333333]"
            >
              <span className="max-w-[120px] truncate">{name}</span>
              <button
                type="button"
                onClick={(e) => onClearImage(idx, e)}
                className="text-gray-400 hover:text-red-500 cursor-pointer"
                aria-label={`إزالة ${name}`}
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {errors.images && (
        <p id="crop-media-error" className="text-xs text-red-500">
          {errors.images}
        </p>
      )}
    </div>
  );
}
