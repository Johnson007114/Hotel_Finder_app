function Pagination ({ Page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return(
        <nav className="pagination" aria-label="Pagination">
            <button disabled={Page === 1} onClick={() => onPageChange(Page - 1)}>
                Previous
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    className={p === Page ? 'active' : ''}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}
            <button disabled={Page === totalPages} onClick={() => onPageChange(Page + 1)}>
                Next
            </button>
        </nav>
    );
}export default Pagination