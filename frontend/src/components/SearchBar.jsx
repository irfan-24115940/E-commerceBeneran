/**
 * ============================================
 * FILE: SearchBar.jsx
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Menu Pencarian
 * ============================================
 */

function SearchBar({ search, setSearch }) {
  return (
    <form className="mb-8">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          border
          border-gray-300
          rounded-2xl
          px-5
          py-4
          outline-none
          focus:ring-2
          focus:ring-black
          shadow-sm
        "
      />
    </form>
  );
}

export default SearchBar;