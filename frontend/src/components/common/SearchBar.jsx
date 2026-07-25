const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  return (
    <input
      type='search'
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBar;
