const FILTERS = ['all', 'pending', 'completed'];

function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      {FILTERS.map((f) => (
        <button
          key={f}
          id={`filter-${f}`}
          className={['filter-btn', active === f ? 'active' : ''].join(' ').trim()}
          onClick={() => onChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
