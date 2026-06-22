function ProductSkeleton() {
  return (
    <div className="card-modern overflow-hidden animate-pulse">
      <div className="h-[220px] bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-9 w-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
